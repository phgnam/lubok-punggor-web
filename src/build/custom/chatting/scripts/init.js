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

    /* BEGIN Tooltip */
    $('[data-toggle="tooltip"]').tooltip();
    /* END Tooltip */
});
