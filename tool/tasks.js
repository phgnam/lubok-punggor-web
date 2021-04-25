const { task, src, dest, parallel, series, watch } = require('gulp')
const broserSync = require('browser-sync').create()
const sourcemaps = require('gulp-sourcemaps')
const cleanCSS = require('gulp-clean-css')
const nunjucks = require('gulp-nunjucks-render')
const beautify = require('gulp-beautify')
const htmlmin = require('gulp-htmlmin')
const through = require('through2')
const rtlcss = require('gulp-rtlcss')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require("gulp-rename")
const gulpif = require('gulp-if')
const colors = require('colors')
const merge = require('merge-stream')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const path = require('path')
const log = require('fancy-log')
const del = require('del')

const helper = require('./helper.js')
const config = helper.parseConfig('config.json').config

let enableProduction = config.production
let enableSourcemaps = enableProduction ? false : config.sourcemaps
let enableHTMLBeautify = enableProduction ? false : config.html_beautify

const uglifyOptions = {
    dev: {
        compress: false,
        mangle: false,
        toplevel: false,
        keep_fnames: true
    },
    prod: {
        compress: true,
        mangle: true,
        toplevel: true,
        keep_fnames: false
    }
}
const cleanCSSOptions = {
    level: {
        1: { all: true }
    }
}
const sourcemapsOptions = {
    sourceRoot: `/${config.path.src}`,
    includeContent: false
}
const sassOptions = {
    outputStyle: config.css_style
}
const htmlminOptions = {
    collapseWhitespace: true,
    removeComments: true
}
const htmlbeautifyOption = {
    indent_size: 4,
    indent_with_tabs: true,
    preserve_newlines: false,
    end_with_newline: true
}

const buildStyle = (input, output) => {
    let streams = []

    const processes = (input, output) => {
        return src(input, { base: config.path.src })
            .pipe(gulpif(enableSourcemaps, sourcemaps.init()))
            .pipe(sass.sync(sassOptions)
                .on('error', err => {
                    broserSync.notify('Error when run build task, check the console')
                    log(`Error at ${colors.cyan(err.relativePath)} on line ${err.line}`)
                    log(colors.red(err.messageOriginal))
                }))
            .pipe(concat(output))
    }

    streams.push(
        processes(input, output)
            .pipe(gulpif(enableProduction, cleanCSS(cleanCSSOptions)))
            .pipe(rename({ prefix: "ltr-" }))
            .pipe(gulpif(enableSourcemaps, sourcemaps.write('./', sourcemapsOptions)))
            .pipe(dest(config.path.dist_build_styles))
            .pipe(broserSync.stream())
    )

    streams.push(
        processes(input, output)
            .pipe(rtlcss())
            .pipe(gulpif(enableProduction, cleanCSS(cleanCSSOptions)))
            .pipe(rename({ prefix: "rtl-" }))
            .pipe(gulpif(enableSourcemaps, sourcemaps.write('./', sourcemapsOptions)))
            .pipe(dest(config.path.dist_build_styles))
            .pipe(broserSync.stream())
    )

    return merge(...streams)
}

const buildScript = (input, output) => {
    return src(input, { base: config.path.src })
        .pipe(gulpif(enableSourcemaps, sourcemaps.init()))
        .pipe(concat(output))
        .pipe(uglify(enableProduction ? uglifyOptions.prod : uglifyOptions.dev))
            .on('error', err => {
                broserSync.notify('Error when run build task, check the console')
                log(`Error: ${colors.red(err.cause.message)}`)
            })
        .pipe(gulpif(enableSourcemaps, sourcemaps.write('./', sourcemapsOptions)))
        .pipe(dest(config.path.dist_build_scripts))
            .on('end', () => {
                broserSync.reload()
            })
}

task('clean', () => del(config.path.dist))

task('assets', () => {
    let streams = []
    let assets = helper.getAssets(['fonts'])
    let types = ['fonts']

    streams.push(
        src(`${config.path.src_assets}/**/*`)
            .pipe(dest(config.path.dist_assets))
    )

    for (let [package, paths] of Object.entries(assets.packages)) {
        types.forEach(type => {
            streams.push(
                src(paths[type])
                    .pipe(dest(`${config.path.dist_assets}/${type}/${package}`))
            )
        })
    }

    return merge(...streams).on('end', () => {
        broserSync.reload()
    })
})

task('build:style-core', () => buildStyle(helper.getBuild('core', ['styles']).compile.styles, config.output.styles.core))

task('build:style-vendor', () => buildStyle(helper.getBuild('optional', ['styles']).compile.styles, config.output.styles.vendor))

task('build:style-custom', () => {
    let streams = []
    let libs = helper.getBuild('custom', ['styles'])

    for (let [name, paths] of Object.entries(libs.compile.styles)) {
        streams.push(buildStyle(paths, `${name}.css`))
    }

    return merge(...streams)
})

task('build:style', parallel('build:style-core', 'build:style-vendor', 'build:style-custom'))

task('build:script-core', () => buildScript(helper.getBuild('core', ['scripts']).compile.scripts, config.output.scripts.core))

task('build:script-mandatory', () => buildScript(helper.getBuild('mandatory', ['scripts']).compile.scripts, config.output.scripts.mandatory))

task('build:script-vendor', () => buildScript(helper.getBuild('optional', ['scripts']).compile.scripts, config.output.scripts.vendor))

task('build:script-custom', () => {
    let streams = []
    let libs = helper.getBuild('custom', ['scripts'])

    for (let [name, paths] of Object.entries(libs.compile.scripts)) {
        streams.push(buildScript(paths, `${name}.js`))
    }

    return merge(...streams)
})

task('build:script-app', () =>
    src(`${config.path.src_app}/**/*.js`, { base: config.path.src_app })
        .pipe(babel({ presets: ['@babel/env'] }))
            .on('error', err => {
                broserSync.notify('Error check the console')
                log(err.message)
            })
        .pipe(uglify(enableProduction ? uglifyOptions.prod : uglifyOptions.dev))
        .pipe(dest(config.path.dist_app))
            .on('end', () => {
                broserSync.reload()
            })
)

task('build:script',  parallel('build:script-core', 'build:script-mandatory', 'build:script-vendor', 'build:script-custom', 'build:script-app'))

task('build:page', () => {
    let filePath = ''
    let prefixPath = ''

    return src(`${config.path.src_pages}/public/**/*.njk`, { base: `${config.path.src_pages}/public/` })
        .pipe(through.obj((chunk, enc, cb) => {
            prefixPath = path.relative(path.dirname(chunk.relative), '')

            if (prefixPath !== '') {
                prefixPath += '/'
            }

            filePath = chunk.relative

            cb(null, chunk)
        }))
        .pipe(nunjucks({
            path: config.path.src_pages,
            manageEnv: (env) => {
                env.addFilter('url', actualPath => `${prefixPath}${actualPath}`)
                env.addFilter('array_push', (arr, val) => [...arr, val])
                env.addFilter('array_join', (arr, sep) => arr.join(sep))
                env.addFilter('array_concat', (arr1, arr2) => typeof arr1 === 'object' && typeof arr2 === 'object' ? [...arr1, ...arr2] : arr1)
            }
        }))
            .on('error', err => {
                broserSync.notify('Error when run build task, check the console')
                log(`Error at ${colors.cyan(err.fileName)}`)
                log(colors.red(err.message))
            })
        .pipe(gulpif(enableHTMLBeautify, beautify.html(htmlbeautifyOption)))
        .pipe(gulpif(enableProduction, htmlmin(htmlminOptions)))
        .pipe(dest(config.path.dist_pages))
            .on('end', () => {
                broserSync.reload()
            })
})

task('build', parallel('build:style', 'build:script', 'build:page', 'assets'))

task('serve', () => {
    let libs = {
        core: helper.getBuild('core', ['styles', 'scripts']),
        mandatory: helper.getBuild('mandatory', ['styles', 'scripts']),
        vendor: helper.getBuild('optional', ['styles', 'scripts']),
        custom: helper.getBuild('custom', ['styles', 'scripts'])
    }

    broserSync.init({
        server: {
            baseDir: config.path.dist,
            index: "index.html",
            routes: {
                '/src': config.path.src
            }
        },
        open: false,
        port: config.port,
        ui: {
            port: config.port + 1
        },
        watchOptions: {
            ignoreInitial: true
        },
        logPrefix: "Panely",
        ghostMode: false,
        timestamps: false
    })

    broserSync.watch(libs.core.watch.styles).on('change', series('build:style-core'))
    broserSync.watch([...libs.vendor.watch.styles, `${config.path.src_build}/vendors/_variables.scss`]).on('change', series('build:style-vendor'))
    broserSync.watch(libs.custom.watch.styles).on('change', series('build:style-custom'))

    broserSync.watch(libs.core.watch.scripts).on('change', series('build:script-core'))
    broserSync.watch(libs.mandatory.watch.scripts).on('change', series('build:script-mandatory'))
    broserSync.watch(libs.vendor.watch.scripts).on('change', series('build:script-vendor'))
    broserSync.watch(libs.custom.watch.scripts).on('change', series('build:script-custom'))

    broserSync.watch(`${config.path.src_app}/**/*.js`).on('change', series('build:script-app'))
    broserSync.watch(`${config.path.src_pages}/**/*.njk`).on('change', series('build:page'))

    broserSync.watch(`${config.path.src_assets}/**/*`).on('change', series('assets'))
    watch(`${config.path.src_assets}/**/*`).on('add', series('assets'))
})
