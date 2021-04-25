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
    $.fn.menu = function(action) {

        // Default variables
        var defaults = {
            element: {
                main: '.menu-item',
                toggle: '.menu-item-toggle',
                menu: '.menu-submenu',
            },
            data: {
                activated: 'menu-activated',
                numParent: 'menu-num-parent',
                height: 'menu-height'
            },
            activeClass: 'active'
        }
        var settings = $.extend({}, defaults, $.fn.menu.defaults);

        // Method list
        var methods = [
            {
                event: 'init',
                action: function() {
                    _init();
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
            }
        ]

        // Calculation method
        function _calc(target) {
            var height = target.outerHeight();

            target.data(settings.data.height, height);
        }

        // Initial method
        function _init() {
            var hasMinimized = $('body').hasClass('aside-minimized');
            var maxParent = 0;

            // Remove .aside-minimized class from body for calculating
            if(hasMinimized){
                $('body').removeClass('aside-minimized')
            }

            // Loop .menu-item element and set number of parent
            $(settings.element.main).each(function(){
                var numParent = $(this).parents(settings.element.menu).length;

                if(numParent > maxParent){
                    maxParent = numParent;
                }

                $(this).data(settings.data.numParent, numParent);
            });

            // Calculate all menu item element height
            for (var i = maxParent; i >= 0; i--) {
                $(settings.element.main).each(function(){

                    // Get menu item number of parents
                    var numParent = $(this).data(settings.data.numParent);

                    // Get submenu element
                    var menu = $(this).children(settings.element.menu);

                    if(numParent == i){
                        $(this).data(settings.data.activated, true);

                        // Check wheater submenu element does exist
                        if(menu.length != 0){

                            // Calculate submenu element height
                            _calc(menu);

                            // Check whather menu item element has active class
                            if($(this).hasClass(settings.activeClass)){
                                _show(menu);
                                $(this).data(settings.data.activated, true);
                            }else{
                                _hide(menu);
                                $(this).data(settings.data.activated, false);
                            }
                        }
                    }
                });
            };

            // Add .aside-minimized class from body
            if(hasMinimized){
                $('body').addClass('aside-minimized')
            }
        }

        // Make event listener for toggle button
        function _listener() {
            $(settings.element.toggle).on('click', function(){

                // Getting target element
                var target = $(this).siblings(settings.element.menu);

                // Getting active state
                var activated = target.data(settings.data.activated);

                activated ? _hide(target) : _show(target);
            })
        }

        // Method to show menu
        function _show(target) {

            // Taking first element
            target = target.first();

            // Checking whether target element has settings.element.menu class
            if (target.hasClass(settings.element.menu.substr(1))) {

                // Getting height and number of parents from element data
                var height = target.data(settings.data.height);
                var numParent = target.parent(settings.element.main).data(settings.data.numParent);

                // Setting target element height
                target.css('height', height);

                // Resetting related parent elements height
                target.parents(settings.element.menu).each(function(){
                    var parentHeight = $(this).data(settings.data.height) + height;

                    $(this).css('height', parentHeight);
                    $(this).data(settings.data.height, parentHeight);
                });

                // Adding active state to target element
                target.siblings(settings.element.toggle).addClass(settings.activeClass);
                target.data(settings.data.activated, true);
            }
        }

        // Method to show menu
        function _hide(target) {

            // Taking first element
            target = target.first();

            // Check whether target element has settings.element.menu class
            if (target.hasClass(settings.element.menu.substr(1))) {

                // Getting height from element data
                var height = target.data(settings.data.height);

                // Setting target element height to zero for collapsing
                target.css('height', 0);

                // Resetting related parent elements height
                target.parents(settings.element.menu).each(function(){
                    var parentHeight = $(this).data(settings.data.height) - height;

                    $(this).data(settings.data.height, parentHeight);
                    $(this).css('height', parentHeight);
                });

                // Removing active state to target element
                target.siblings(settings.element.toggle).removeClass(settings.activeClass);
                target.data(settings.data.activated, false);
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
        // Initialize menu
        $().menu('init');
    })
}));
