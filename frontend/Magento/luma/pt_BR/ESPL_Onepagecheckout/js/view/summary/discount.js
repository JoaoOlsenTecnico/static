/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*global define*/
define(
    [
        'Magento_Checkout/js/view/summary/abstract-total',
        'Magento_Checkout/js/model/quote'
    ],
    function (Component, quote) {
        "use strict";
        return Component.extend({
            defaults: {
                template: 'ESPL_Onepagecheckout/summary/discount'
            },
            totals: quote.getTotals(),
            isDisplayed: function () {
                return this.isFullMode() && this.getPureValue() != 0;
            },
            getCouponCode: function () {
                if (!this.totals()) {
                    return null;
                }

                return this.totals()['coupon_code'];
            },
            getPureValue: function () {
                var price = 0;
                if (this.totals() && this.totals().discount_amount) {
                    price = parseFloat(this.totals().discount_amount);
                }

                return price;
            },
            getValue: function () {
                return this.getFormattedPrice(this.getPureValue());
            }
        });
    }
);

