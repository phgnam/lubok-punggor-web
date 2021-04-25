$(function() {
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

    /* BEGIN Footer copyright year */
    var date = new Date();

    // Add copyright year to the element
    $('#copyright-year').html(date.getFullYear());
    /* END Footer copyright year */

    /* BEGIN Tooltip */
    $('[data-toggle="tooltip"]').tooltip();
    /* END Tooltip */
});
