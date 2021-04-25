$(function() {
    /* BEGIN Sticky header */
    var stickyBreakpoint = 1025;
    var stickyConfig = {
        topSpacing: 0
    };
    var stickyHeaderDesktopElement = '#sticky-header-desktop';
    var stickyHeaderMobileElement = '#sticky-header-mobile';

    // Method to initialize sticky header
    function stickyInit(target) {
        if ($(target).parent('.sticky-wrapper').length < 1) {
            $(target).sticky(stickyConfig);
        }
    }

    // Method to destroy sticky header
    function stickyDestroy(target) {
        $(target).unstick();
    }

    // Listen window resize event for responsive
    $(window).resize(function() {
        var viewport = $(this).width();

        // Check viewport breakpoint
        if (viewport >= stickyBreakpoint) {
            stickyInit(stickyHeaderDesktopElement);
            stickyDestroy(stickyHeaderMobileElement);
        } else {
            stickyInit(stickyHeaderMobileElement);
            stickyDestroy(stickyHeaderDesktopElement);
        }
    });

    // Initialize sticky header for the first time
    if ($(window).width() >= stickyBreakpoint) {
        stickyInit(stickyHeaderDesktopElement);
    } else {
        stickyInit(stickyHeaderMobileElement);
    }
    /* END Sticky header */

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

    /* BEGIN Fullscreen switcher */
    $('#fullscreen-trigger').on('click', function() {
        var active = $('body').data('fullscreen-active');

        // Toggling fullscreen mode
        active ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    });

    // Listen fullscreen event
    document.onfullscreenchange = function() {

        // Toggling fullscreen-active class
        if (document.fullscreenElement) {
            $('body').addClass('fullscreen-active');
            $('body').data('fullscreen-active', true);
        } else {
            $('body').removeClass('fullscreen-active');
            $('body').data('fullscreen-active', false);
        }
    };
    /* END Fullscreen switcher */

    /* BEGIN Simplebar in dropdown */
    $('.dropdown').on('show.bs.dropdown', function() {
        $('[data-toggle="simplebar"]').each(function() {
            new SimpleBar(this);
        });
    });
    /* END Simplebar in dropdown */

    /* BEGIN Footer copyright year */
    var date = new Date();

    // Add copyright year to the element
    $('#copyright-year').html(date.getFullYear());
    /* END Footer copyright year */

    /* BEGIN Tooltip and popover */
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();
    /* END Tooltip and popover */
});
