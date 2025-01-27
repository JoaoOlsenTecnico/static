/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'ko',
    'jquery',
    'underscore',
    '../template/renderer',
    'jquery/ui'
], function (ko, $, _, renderer) {
    'use strict';

    var isTouchDevice = !_.isUndefined(document.ontouchstart),
        sliderFn = 'slider';

    ko.bindingHandlers.range = {

        /**
         * Initializes binding and a slider update.
         *
         * @param {HTMLElement} element
         * @param {Function} valueAccessor
         */
        init: function (element, valueAccessor) {
            var config  = valueAccessor(),
                value   = config.value;

            _.extend(config, {
                value: value(),

                /**
                 * Callback which is being called when sliders' value changes.
                 *
                 * @param {Event} event
                 * @param {Object} ui
                 */
                slide: function (event, ui) {
                    value(ui.value);
                }
            });

            $(element)[sliderFn](config);
        },

        /**
         * Updates sliders' plugin configuration.
         *
         * @param {HTMLElement} element
         * @param {Function} valueAccessor
         */
        update: function (element, valueAccessor) {
            var config = valueAccessor();

            config.value = ko.unwrap(config.value);

            $(element)[sliderFn]('option', config);
        }
    };

    renderer.addAttribute('range');

    if (!isTouchDevice) {
        return;
    }

    $.widget('mage.touchSlider', $.ui.slider, {

        /**
         * Creates instance of widget.
         *
         * @override
         */
        _create: function () {
            _.bindAll(
                this,
                '_mouseDown',
                '_mouseMove',
                '_onTouchEnd'
            );

            return this._superApply(arguments);
        },

        /**
         * Initializes mouse events on element.
         * @override
         */
        _mouseInit: function () {
            var result = this._superApply(arguments);

            this.element
                .off('mousedown.' + this.widgetName)
                .on('touchstart.' + this.widgetName, this._mouseDown);

            return result;
        },

        /**
         * Elements' 'mousedown' event handler polyfill.
         * @override
         */
        _mouseDown: function (event) {
            var prevDelegate = this._mouseMoveDelegate,
                result;

            event = this._touchToMouse(event);
            result = this._super(event);

            if (prevDelegate === this._mouseMoveDelegate) {
                return result;
            }

            $(document)
                .off('mousemove.' + this.widgetName)
                .off('mouseup.' + this.widgetName);

            $(document)
                .on('touchmove.' + this.widgetName, this._mouseMove)
                .on('touchend.' + this.widgetName, this._onTouchEnd)
                .on('tochleave.' + this.widgetName, this._onTouchEnd);

            return result;
        },

        /**
         * Documents' 'mousemove' event handler polyfill.
         *
         * @override
         * @param {Event} event - Touch event object.
         */
        _mouseMove: function (event) {
            event = this._touchToMouse(event);

            return this._super(event);
        },

        /**
         * Documents' 'touchend' event handler.
         */
        _onTouchEnd: function (event) {
            $(document).trigger('mouseup');

            return this._mouseUp(event);
        },

        /**
         * Removes previously assigned touch handlers.
         *
         * @override
         */
        _mouseUp: function () {
            this._removeTouchHandlers();

            return this._superApply(arguments);
        },

        /**
         * Removes previously assigned touch handlers.
         *
         * @override
         */
        _mouseDestroy: function () {
            this._removeTouchHandlers();

            return this._superApply(arguments);
        },

        /**
         * Removes touch events from document object.
         */
        _removeTouchHandlers: function () {
            $(document)
                .off('touchmove.' + this.widgetName)
                .off('touchend.' + this.widgetName)
                .off('touchleave.' + this.widgetName);
        },

        /**
         * Adds properties to the touch event to mimic mouse event.
         *
         * @param {Event} event - Touch event object.
         * @returns {Event}
         */
        _touchToMouse: function (event) {
            var orig = event.originalEvent,
                touch = orig.touches[0];

            return _.extend(event, {
                which:      1,
                pageX:      touch.pageX,
                pageY:      touch.pageY,
                clientX:    touch.clientX,
                clientY:    touch.clientY,
                screenX:    touch.screenX,
                screenY:    touch.screenY
            });
        }
    });

    sliderFn = 'touchSlider';
});
