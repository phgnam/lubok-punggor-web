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
            toggleElement: '[data-toggle="aside"]',
            backdropElement: '#aside-backdrop',
            bodyClass: 'aside-show',
            transitionDuration: 200,
            transitionEasing: 'linear'

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
                action: function() {
                    _show();
                }
            },
            {
                event: 'hide',
                action: function() {
                    _hide();
                }
            },
            {
                event: 'toggle',
                action: function() {
                    _toggle();
                }
            }
        ];

        function _show() {
            $('body').addClass(settings.bodyClass)

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

        function _hide() {
            $('body').removeClass(settings.bodyClass)

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

        function _toggle() {
            $('body').hasClass(settings.bodyClass) ? _hide() : _show()
        }

        function _init() {
            $(settings.toggleElement).on('click', function() {
                _toggle()
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
