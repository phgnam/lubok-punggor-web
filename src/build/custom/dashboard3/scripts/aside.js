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
    $.aside = function(action, param) {

        // Default variables
        var defaults = {
            breakpoint: 768,
            breakpointResponsive: 1025,
            toggleElement: '[data-toggle="aside"]',
            backdropElement: '#aside-backdrop',
            transitionDuration: 200,
            transitionEasing: 'linear',
            class: {
                menu: 'aside-menu-show',
                content: 'aside-content-show'
            }
        };
        var settings = $.extend({}, defaults, $.aside.defaults);

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
                action: function(param) {
                    _show(param);
                }
            },
            {
                event: 'hide',
                action: function(param) {
                    _hide(param);
                }
            }
        ];

        function _hide(target) {
            var viewport = $(window).width();

            if (viewport < settings.breakpoint) {
                $('body').removeClass(settings.class[target]);

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

        function _show(target) {
            var viewport = $(window).width();

            if (viewport < settings.breakpoint) {
                $('body').addClass(settings.class[target]);

                var backdrop = '<div id="' + settings.backdropElement.substr(1) + '"></div>';

                // Creating backdrop and animate it
                $(backdrop).appendTo('body').data('target', target).animate({
                    opacity: 1,
                }, {
                    duration: settings.transitionDuration,
                    easing: settings.transitionEasing,
                    complete: function() {
                        $(this).on('click', function() {
                            _hide($(this).data('target'))
                        })
                    }
                });
            }
        }

        function _init() {
            $(settings.toggleElement).on('click', function() {
                var viewport = $(window).width();
                var target = $(this).data('target');

                if ($('body').hasClass('aside-' + target + '-show')) {
                    _hide(target);
                } else {
                    _show(target);
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
        $.aside('init');
    })
}));
