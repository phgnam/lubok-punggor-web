const traverse = require('traverse')
const colors = require('colors')
const glob = require('glob')
const log = require('fancy-log')
const fs = require('fs')

const parseConfig = path => {
    // Get file
    let file = fs.readFileSync(path)

    // Parse data
    return JSON.parse(file)
}
const getBuild = (part, allow) => {

    // Defines all variables needed
    const config = parseConfig('config.json')
    const libs = {
        core: config.build.core,
        mandatory: config.build.vendors.mandatory,
        optional: config.build.vendors.optional,
        custom: config.build.custom
    }
    const skip = config.config.skip
    const allowed = ['scripts', 'styles']

    // Parameter validation
    allow = allow.filter(type => {
        return allowed.includes(type)
    })

    return traverse(libs[part]).reduce(function (result, package) {
        if (allow.includes(this.key)) {

            let name = this.parent.key
            let path = this.path
            let type = this.key

            if (part === 'custom') {
                result.compile.scripts[name] = []
                result.compile.styles[name] = []
            }

            if (part === 'optional' && skip.includes(name)) {
                if (!result.skip.includes(name)) {
                    result.skip.push(name)
                }
            } else {
                if (package.hasOwnProperty('watch') || package.hasOwnProperty('compile')) {

                    Object.keys(package).forEach(category => {
                        package[category].forEach(pattern => {
                            let links = glob.sync(pattern)

                            if (links.length > 0) {
                                if (part === 'custom') {
                                    if (category == 'compile') {
                                        result[category][type][name].push(pattern)
                                    } else if (category == 'watch') {
                                        result[category][type].push(pattern)
                                    }
                                } else {
                                    result[category][type].push(pattern)
                                }
                            } else {
                                log(`${colors.red(pattern)} not found`)
                                result.notFound.push(pattern)
                            }
                        })
                    })

                } else {

                    package.forEach(pattern => {
                        let links = glob.sync(pattern)

                        if (links.length > 0) {
                            if (part === 'custom') {
                                result.watch[type].push(pattern)
                                result.compile[type][name].push(pattern)
                            } else {
                                result.watch[type].push(pattern)
                                result.compile[type].push(pattern)
                            }
                        } else {
                            log(`${colors.red(pattern)} not found`)
                            result.notFound.push(pattern)
                        }
                    })

                }
            }
        }
        return result
    }, {
        notFound: [],
        skip: [],
        compile: {
            scripts: [],
            styles: []
        },
        watch: {
            scripts: [],
            styles: []
        }
    })
}
const getAssets = allow => {

    // Defines all variables needed
    const config = parseConfig('config.json')
    const libs = config.build
    const skip = config.config.skip
    const allowed = ['fonts']

    // Parameter validation
    allow = allow.filter(type => {
        return allowed.includes(type)
    })

    return traverse(libs).reduce(function (result, package) {
        if (allow.includes(this.key)) {

            let name = this.parent.key
            let path = this.path
            let type = this.key

            if (path.includes('optional') && skip.includes(name)) {

                if (!result.skip.includes(name)) {
                    result.skip.push(name)
                }

            } else {

                result.packages[name] = {}
                result.packages[name][type] = []

                package.forEach(pattern => {
                    let links = glob.sync(pattern)

                    if (links.length > 0) {

                        result.packages[name][type].push(pattern)
                    } else {
                        log(`${colors.red(pattern)} not found`)
                        result.notFound.push(pattern)
                    }
                })

            }
        }
        return result
    }, {
        notFound: [],
        skip: [],
        packages: {}
    })
}

module.exports = { parseConfig, getBuild, getAssets }
