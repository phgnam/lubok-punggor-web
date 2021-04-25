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
    $.chatColumn = function(action, param) {

        // Default variables
        var defaults = {
            breakpoint: 768,
            toggleElement: '[data-toggle="chat"]',
            backdropElement: '#chat-backdrop',
            transitionDuration: 200,
            transitionEasing: 'linear',
            class: {
                desktop: {
                    contact: 'chat-contact-desktop-show',
                    info: 'chat-info-desktop-show'
                },
                mobile: {
                    contact: 'chat-contact-mobile-show',
                    info: 'chat-info-mobile-show'
                }
            }
        };
        var settings = $.extend({}, defaults, $.chatColumn.defaults);

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

        function _mobileHide(target) {
            $('body').removeClass(settings.class.mobile[target]);

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

        function _mobileShow(target) {
            $('body').addClass(settings.class.mobile[target]);

            var backdrop = '<div id="' + settings.backdropElement.substr(1) + '"></div>';

            // Creating backdrop and animate it
            $(backdrop).appendTo('body').data('target', target).animate({
                opacity: 1,
            }, {
                duration: settings.transitionDuration,
                easing: settings.transitionEasing,
                complete: function() {
                    $(this).on('click', function() {
                        _mobileHide($(this).data('target'))
                    })
                }
            });
        }

        function _desktopHide(target) {
            $('body').addClass(settings.class.desktop[target]);
        }

        function _desktopShow(target) {
            $('body').removeClass(settings.class.desktop[target]);
        }

        function _toggle(target) {
            var viewport = $(window).width();

            if (viewport < settings.breakpoint) {
                if ($('body').hasClass('chat-' + target + '-mobile-show')) {
                    _mobileHide(target);
                } else {
                    _mobileShow(target);
                }
            } else {
                if ($('body').hasClass('chat-' + target + '-desktop-show')) {
                    _desktopShow(target);
                } else {
                    _desktopHide(target);
                }
            }
        }

        function _show(target) {
            var viewport = $(window).width();

            if (viewport < settings.breakpoint) {
                _desktopShow(target);
            } else {
                _mobileShow(target);
            }
        }

        function _hide(target) {
            var viewport = $(window).width();

            if (viewport < settings.breakpoint) {
                _desktopHide(target);
            } else {
                _mobileHide(target);
            }
        }

        function _init() {
            $(settings.toggleElement).on('click', function() {
                var target = $(this).data('target');
                _toggle(target);
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
        $.chatColumn('init');
    })
}));
