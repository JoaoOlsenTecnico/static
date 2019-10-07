/*browser:true jquery:true*/
/*global define*/
define(
    [
        'jquery',
        'uiComponent'
    ],
    function ($, Component) {
        'use strict';
        var socialLoginConfig;

        return Component.extend({
            defaults: {
                template: 'TemplateMonster_SocialLogin/checkout/social-login'
            },
            dataScope: 'global',
            initialize: function() {
                this._super();

                if (window[this.configSource] && window[this.configSource]['socialLogin']) {
                    socialLoginConfig = window[this.configSource]['socialLogin'];
                }
            },

            isEnabled: function () {
                return socialLoginConfig['isEnabled'];
            },

            getProviders: function() {
                return socialLoginConfig['providers'];
            }
        });
    }
);
