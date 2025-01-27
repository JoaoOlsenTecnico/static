/*jshint browser:true*/
/*global alert*/
/**
 * Checkout adapter for customer data storage
 */
define(
    [
        'jquery',
        'Magento_Checkout/js/action/set-shipping-information',
        'Magento_Checkout/js/model/step-navigator',
        'Magento_Customer/js/model/address-list',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/action/create-shipping-address',
        'Magento_Checkout/js/action/select-shipping-address',
        'Magento_Checkout/js/action/select-shipping-method',
        'Magento_Checkout/js/model/payment-service',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/model/address-converter',
        'Magento_Checkout/js/action/select-billing-address',
        'Magento_Checkout/js/action/create-billing-address',
        'underscore'
    ],
    function (
        $,
        setShippingInformationAction,
        stepNavigator,
        addressList,
        quote,
        checkoutData,
        createShippingAddress,
        selectShippingAddress,
        selectShippingMethodAction,
        paymentService,
        selectPaymentMethodAction,
        addressConverter,
        selectBillingAddress,
        createBillingAddress,
        _
    ) {
        'use strict';

        return {

            /**
             * Resolve estimation address. Used local storage
             */
            resolveEstimationAddress: function () {
                var address;

                if (checkoutData.getShippingAddressFromData()) {
                    address = addressConverter.formAddressDataToQuoteAddress(checkoutData.getShippingAddressFromData());
                    selectShippingAddress(address);
                } else {
                    this.resolveShippingAddress();
                }

                if (quote.isVirtual()) {
                    if (checkoutData.getBillingAddressFromData()) {
                        address = addressConverter.formAddressDataToQuoteAddress(
                            checkoutData.getBillingAddressFromData()
                        );
                        selectBillingAddress(address);
                    } else {
                        this.resolveBillingAddress();
                    }
                }

            },

            /**
             * Resolve shipping address. Used local storage
             */
            resolveShippingAddress: function () {
                var newCustomerShippingAddress = checkoutData.getNewCustomerShippingAddress();

                if (newCustomerShippingAddress) {
                    createShippingAddress(newCustomerShippingAddress);
                }

                this.applyShippingAddress();

            },

            /**
             * Apply resolved estimated address to quote
             *
             * @param {Object} isEstimatedAddress
             */
            applyShippingAddress: function (isEstimatedAddress) {
                var address,
                    shippingAddress,
                    isConvertAddress,
                    addressData,
                    isShippingAddressInitialized;

                if (addressList().length == 0) {
                    address = addressConverter.formAddressDataToQuoteAddress(
                        checkoutData.getShippingAddressFromData()
                    );
                    selectShippingAddress(address);
                }

                shippingAddress = quote.shippingAddress();
                isConvertAddress = isEstimatedAddress || false;

                if (!shippingAddress) {
                    isShippingAddressInitialized = addressList.some(function (addressFromList) {
                        if (checkoutData.getSelectedShippingAddress() == addressFromList.getKey()) {
                            addressData = isConvertAddress ?
                                addressConverter.addressToEstimationAddress(addressFromList)
                                : addressFromList;
                            selectShippingAddress(addressData);

                            return true;
                        }

                        return false;
                    });

                    if (!isShippingAddressInitialized) {
                        isShippingAddressInitialized = addressList.some(function (address) {
                            if (address.isDefaultShipping()) {
                                addressData = isConvertAddress ?
                                    addressConverter.addressToEstimationAddress(address)
                                    : address;
                                selectShippingAddress(addressData);

                                return true;
                            }

                            return false;
                        });
                    }

                    if (!isShippingAddressInitialized && addressList().length == 1) {
                        addressData = isConvertAddress ?
                            addressConverter.addressToEstimationAddress(addressList()[0])
                            : addressList()[0];
                        selectShippingAddress(addressData);
                    }
                }
            },

            /**
             * @param {Object} ratesData
             */
            resolveShippingRates: function (ratesData) {
                var selectedShippingRate = checkoutData.getSelectedShippingRate(),
                    availableRate = false;

                if (ratesData.length == 1) {
                    //set shipping rate if we have only one available shipping rate
                    selectShippingMethodAction(ratesData[0]);
                    setShippingInformationAction();
                    return;
                }

                if (quote.shippingMethod()) {
                    availableRate = _.find(ratesData, function (rate) {
                        return rate.carrier_code == quote.shippingMethod().carrier_code &&
                            rate.method_code == quote.shippingMethod().method_code;
                    });
                }

                if (!availableRate && selectedShippingRate) {
                    availableRate = _.find(ratesData, function (rate) {
                        return rate.carrier_code + '_' + rate.method_code === selectedShippingRate;
                    });
                }

                if (!availableRate && window.checkoutConfig.selectedShippingMethod) {
                    availableRate = true;
                    selectShippingMethodAction(window.checkoutConfig.selectedShippingMethod);
                    stepNavigator.next();
                }

                //Unset selected shipping method if not available
                if (!availableRate) {
                    selectShippingMethodAction(null);
                    if (!quote.isVirtual()) {
                        paymentService.setPaymentMethods([]);
                    }
                } else {
                    if (typeof(availableRate) === 'object') {
                        selectShippingMethodAction(availableRate);
                        setShippingInformationAction();
                    } else {
                        selectShippingMethodAction(availableRate);
                    }
                }
            },

            /**
             * Resolve payment method. Used local storage
             */
            resolvePaymentMethod: function () {
                var availablePaymentMethods = paymentService.getAvailablePaymentMethods(),
                    selectedPaymentMethod = checkoutData.getSelectedPaymentMethod();

                if (selectedPaymentMethod) {
                    availablePaymentMethods.some(function (payment) {
                        if (payment.method == selectedPaymentMethod) {
                            selectPaymentMethodAction(payment);
                        }
                    });
                }
            },

            /**
             * Resolve billing address. Used local storage
             */
            resolveBillingAddress: function () {
                var selectedBillingAddress = checkoutData.getSelectedBillingAddress(),
                    newCustomerBillingAddressData = checkoutData.getNewCustomerBillingAddress();

                if (selectedBillingAddress) {
                    if (selectedBillingAddress == 'new-customer-address' && newCustomerBillingAddressData) {
                        selectBillingAddress(createBillingAddress(newCustomerBillingAddressData));
                    } else {
                        addressList.some(function (address) {
                            if (selectedBillingAddress == address.getKey()) {
                                selectBillingAddress(address);
                            }
                        });
                    }
                } else {
                    this.applyBillingAddress();
                }
            },

            /**
             * Apply resolved billing address to quote
             */
            applyBillingAddress: function () {
                var shippingAddress;

                if (quote.billingAddress()) {
                    selectBillingAddress(quote.billingAddress());

                    return;
                }

                shippingAddress = quote.shippingAddress();

                if (shippingAddress &&
                    shippingAddress.canUseForBilling() &&
                    (shippingAddress.isDefaultShipping() || !quote.isVirtual())
                ) {
                    //set billing address same as shipping by default if it is not empty
                    selectBillingAddress(quote.shippingAddress());
                }
            }
        };
    }
);

