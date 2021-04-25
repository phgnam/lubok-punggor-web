$(function() {
    /* BEGIN Sticky element */
    var stickyBreakpoint = 1025;
    var stickyHeaderDesktopElement = '#sticky-header-desktop';
    var stickyHeaderMobileElement = '#sticky-header-mobile';
    var stickyAsideElement = '#sticky-aside';
    var stickyHeaderConfig = {
        topSpacing: 0
    };
    var stickyAsideConfig = {
        topSpacing: $(stickyHeaderDesktopElement).outerHeight()
    };

    // Method initialize simplebar on aside body
    function asideScrollbarInit() {
        setTimeout(function() {
            new SimpleBar($(stickyAsideElement).find('[data-toggle="simplebar"]')[0]);
        }, 10)
    }

    // Method to initialize sticky element
    function stickyInit(target, config) {
        if ($(target).parent('.sticky-wrapper').length < 1) {
            $(target).sticky(config);
        }
    }

    // Method to destroy sticky element
    function stickyDestroy(target) {
        $(target).unstick();
    }

    // Listen window resize event for responsive
    $(window).resize(function() {
        var viewport = $(this).width();

        // Check viewport breakpoint
        if (viewport >= stickyBreakpoint) {
            stickyInit(stickyAsideElement, stickyAsideConfig);
            stickyInit(stickyHeaderDesktopElement, stickyHeaderConfig);
            stickyDestroy(stickyHeaderMobileElement);
        } else {
            stickyInit(stickyHeaderMobileElement, stickyHeaderConfig);
            stickyDestroy(stickyHeaderDesktopElement);
            stickyDestroy(stickyAsideElement);
        }

        asideScrollbarInit();
    });

    // Initialize sticky element for the first time
    if ($(window).width() >= stickyBreakpoint) {
        stickyInit(stickyHeaderDesktopElement, stickyHeaderConfig);
        stickyInit(stickyAsideElement, stickyAsideConfig);
    } else {
        stickyInit(stickyHeaderMobileElement, stickyHeaderConfig);
    }

    asideScrollbarInit();
    /* END Sticky element */

    /* BEGIN Theme switcher */
    $('#theme-toggle').on('click', function() {
        var isDark = $('body').hasClass('theme-dark');

        // Toggling theme class
        if (isDark) {
            $('body').removeClass('theme-dark');
            $('body').addClass('theme-light');
            $(this).children('i').removeClass('fa-sun');
            $(this).children('i').addClass('fa-moon');
        } else {
            $('body').removeClass('theme-light');
            $('body').addClass('theme-dark');
            $(this).children('i').removeClass('fa-moon');
            $(this).children('i').addClass('fa-sun');
        }
    });
    /* END Theme switcher */

    /* BEGIN Simplebar in dropdown */
    $('.dropdown').on('show.bs.dropdown', function() {
        $('[data-toggle="simplebar"]').each(function() {
            new SimpleBar(this);
        });
    });
    /* END Simplebar in dropdown */

    /* BEGIN Tooltip */
    $('[data-toggle="tooltip"]').tooltip();
    /* END Tooltip */
});
