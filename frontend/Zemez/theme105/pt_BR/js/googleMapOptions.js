define([
    'jquery',
    'jquery/ui',
    'googleMapPagePlugin'
], function($, mageTemplate ,pluginTemplate) {
    'use strict';

    $.widget('TemplateMonster.googleMapOptions', $.TemplateMonster.googleMapPagePlugin, {

        options: {
            contactSelector: '.contact-us_googlemap__wrapper'
        },

        _create: function() {
            this._super();
        }

    });

    return $.TemplateMonster.googleMapOptions;
});