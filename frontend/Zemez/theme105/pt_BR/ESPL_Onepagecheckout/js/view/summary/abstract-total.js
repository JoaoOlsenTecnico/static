define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/quote',
        'Magento_Catalog/js/price-utils',
        'Magento_Checkout/js/model/totals',
        'Magento_Checkout/js/model/step-navigator'
    ],
    function (Component, quote, priceUtils, totals, stepNavigator) {
        "use strict";
        return Component.extend({
            getFormattedPrice: function (price) {
                return priceUtils.formatPrice(price, quote.getPriceFormat());
            },
            getTotals: function () {
                return totals.totals();
            },
            isFullMode: function () {
                if (!this.getTotals()) {
                    return false;
                }

                if (window.checkoutConfig.isEnabledOneStepCheckout) {
                    return true;
                }

                return stepNavigator.isProcessed('shipping');
            }
        });
    }
);

