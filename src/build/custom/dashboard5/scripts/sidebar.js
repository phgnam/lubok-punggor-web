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
    $.sidebar = function(action, param) {

        // Default variables
        var defaults = {
            breakpoint: 1025,
            toggleElement: '[data-toggle="sidebar"]',
            backdropElement: '#sidebar-backdrop',
            transitionDuration: 200,
            transitionEasing: 'linear',
            activeClass: 'sidebar-show'
        };
        var settings = $.extend({}, defaults, $.sidebar.defaults);

        // Method list
        var methods = [
            {
                event: 'init',
                action: function() {
                    _init()
                }
            },
            {
                event: 'show',
                action: function() {
                    _show();
                }
            },
            {
                event: 'hide',
                action: function() {
                    _hide();
                }
            }
        ];

        function _hide() {
            var viewport = $(window).width();

            if (viewport < settings.breakpoint) {
                $('body').removeClass(settings.activeClass);

                $(settings.backdropElement).animate({
                    opacity: 0,
                }, {
                    duration: settings.transitionDuration,
                    easing: settings.transitionEasing,
                    complete: function() {

                        // Destroy backdrop
                        $(this).remove();
                    }
                }).off();
            }
        }

        function _show() {
            var viewport = $(window).width();

            if (viewport < settings.breakpoint) {
                $('body').addClass(settings.activeClass);

                var backdrop = '<div id="' + settings.backdropElement.substr(1) + '"></div>';

                // Creating backdrop and animate it
                $(backdrop).appendTo('body').animate({
                    opacity: 1,
                }, {
                    duration: settings.transitionDuration,
                    easing: settings.transitionEasing,
                    complete: function() {
                        $(this).on('click', function() {
                            _hide()
                        })
                    }
                });
            }
        }

        function _init() {
            $(settings.toggleElement).on('click', function() {
                if ($('body').hasClass(settings.activeClass)) {
                    _hide();
                } else {
                    _show();
                }
            })
        }

        if (typeof action == 'string') {
            methods.forEach(function(method) {
                if (action == method.event) {
                    method.action(param);
                }
            })
        }
    }

    $(function() {
        $.sidebar('init');
    })
}));
