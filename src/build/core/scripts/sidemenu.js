(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    "use strict";
    $.fn.sidemenu = function(action) {

        // Default variables
        var defaults = {
            element: {
                main: '.sidemenu',
                backdrop: '#sidemenu-backdrop',
                toggle: '[data-toggle="sidemenu"]',
                dismiss: '[data-dismiss="sidemenu"]',
            },
            class: {
                body: 'sidemenu-open',
                active: 'active'
            },
            data: {
                active: 'sidemenu-active',
            },
            easing: 'linear',
            transitionDuration: 200
        }
        var settings = $.extend({}, defaults, $.fn.sidemenu.defaults);

        // Method list
        var methods = [
            {
                event: 'listener',
                action: function() {
                    _listener();
                }
            },
            {
                event: 'show',
                action: function(target) {
                    _show(target);
                }
            },
            {
                event: 'hide',
                action: function(target) {
                    _hide(target);
                }
            },
            {
                event: 'toggle',
                action: function(target) {
                    _toggle(target);
                }
            },
        ]

        // Add event listener to sidemenu trigger
        function _listener() {

            // Toggle event listener
            $(settings.element.toggle).on('click', function() {
                var target = $(this).data('target');
                _toggle($(target));
            })

            // Dismiss event listener
            $(settings.element.dismiss).on('click', function() {
                _hide($(this.closest(settings.element.main)));
            })
        }

        // Toggle sidemenu
        function _toggle(target) {
            // Checking wether sidemenu has activated or not
            if ($('body').hasClass(settings.class.body) || target.data(settings.data.active)) {
                _hide(target);
            } else {
                _show(target);
            }
        }

        // Show sidemenu
        function _show(target) {

            // Checking wether target element has settings.element.main class
            if (target.hasClass(settings.element.main.substr(1))) {

                // Adding active class to body and .sidemenu elements
                target.addClass(settings.class.active);
                $('body').addClass(settings.class.body);

                // Checking wether backdrop has been initialized to prevent duplicate
                if ($(settings.element.backdrop).length < 1) {
                    var backdrop = '<div id="' + settings.element.backdrop.substr(1) + '"></div>';

                    // Creating backdrop element and animate it
                    $(backdrop).appendTo('body').animate({
                        opacity: 1,
                    }, {
                        duration: settings.transitionDuration,
                        easing: settings.easing,
                        complete: function() {
                            $(this).on('click', function() {
                                _hide(target)
                            })
                        }
                    })
                }

                // Adding html data to the element that is activated
                target.data(settings.data.active, true);
            }
        }

        // Hide sidemenu
        function _hide(target) {

            // Checking wether target element has settings.element.main class
            if (target.hasClass(settings.element.main.substr(1))) {

                // Removing active class to body and .sidemenu elements
                target.removeClass(settings.class.active);
                $('body').removeClass(settings.class.body);

                // Checking wether backdrop has been initialized
                if ($(settings.element.backdrop).length > 0) {

                    // Animating backdrop element
                    $(settings.element.backdrop).animate({
                        opacity: 0,
                    }, {
                        duration: settings.transitionDuration,
                        easing:  settings.easing,
                        complete: function() {
                            $(this).remove()
                        }
                    }).off()
                }

                // Adding html data to the element that is deactivated
                target.data(settings.data.active, false);
            }
        }

        var element = $(this);

        if (typeof action == 'string') {
            methods.forEach(function(method) {
                if (action == method.event) {
                    method.action(element)
                }
            })
        }

        return this
    }

    $(function() {
        $().sidemenu('listener');
    })
}));
