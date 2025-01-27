/*jshint browser:true jquery:true*/
/*global alert*/
define(
    [
        'mageUtils',
        'Magento_Payment/js/model/credit-card-validation/credit-card-number-validator/luhn10-validator',
        'Moip_Magento2/js/model/credit-card-validation/credit-card-number-validator/credit-card-type'
    ],
    function (utils, luhn10, creditCardTypes) {
        'use strict';

        function resultWrapper(card, isPotentiallyValid, isValid) {
            return {
                card: card,
                isValid: isValid,
                isPotentiallyValid: isPotentiallyValid
            };
        }

        return function (value) {
            var potentialTypes,
                cardType,
                valid,
                i,
                maxLength;

            if (utils.isEmpty(value)) {
                return resultWrapper(null, false, false);
            }

            value = value.replace(/\-|\s/g, '');

            if (!/^\d*$/.test(value)) {
                return resultWrapper(null, false, false);
            }

            potentialTypes = creditCardTypes.getCardTypes(value);
			
            if (potentialTypes.length === 0) {
                return resultWrapper(null, false, false);
            } else if (potentialTypes.length !== 1) {
                return resultWrapper(null, true, false);
            }

            cardType = potentialTypes[0];
			
            if (cardType.type === 'unionpay') { 
                valid = true;
            } else {
                valid = luhn10(value);
            }

            for (i = 0; i < cardType.lengths.length; i++) {
                if (cardType.lengths[i] === value.length) {
                    return resultWrapper(cardType, valid, valid);
                }
            }

            maxLength = Math.max.apply(null, cardType.lengths);

            if (value.length < maxLength) {
                return resultWrapper(cardType, true, false);
            }

            return resultWrapper(cardType, false, false);
        };
    }
);
