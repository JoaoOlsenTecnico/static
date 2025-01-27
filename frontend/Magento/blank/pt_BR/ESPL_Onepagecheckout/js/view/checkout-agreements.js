/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define(
    [
        'ko',
        'jquery',
        'uiComponent',
        'ESPL_Onepagecheckout/js/model/agreements/agreements-modal',
        'ESPL_Onepagecheckout/js/espl/plugins/jquery.nicescroll.min'
    ],
    function (ko, $, Component, agreementsModal) {
        'use strict';
        var agreementsConfig = window.checkoutConfig.checkoutAgreements,
            agreementManualMode = 1;

        return Component.extend({
            defaults: {
                template: 'ESPL_Onepagecheckout/checkout/checkout-agreements'
            },
            isVisible: agreementsConfig.isEnabled,
            agreements: agreementsConfig.agreements,
            modalTitle: ko.observable(null),
            modalContent: ko.observable(null),
            modalWindow: null,

            /**
             * Checks if agreement required
             *
             * @param element
             */
            isAgreementRequired: function (element) {
                return element.mode == agreementManualMode;
            },

            /**
             * Show agreement content in modal
             *
             * @param element
             */
            showContent: function (element) {
                this.modalTitle(element.checkboxText);
                this.modalContent(element.content);
                agreementsModal.showModal();
                $('.espl-checkout-agreements-modal').closest('.modal-content').niceScroll({cursorcolor:"#e5e5e5",cursorwidth:"8px",railpadding: { top: 0, right: 7, left: 0, bottom: 0 }});
            },

            /**
             * Init modal window for rendered element
             *
             * @param element
             */
            initModal: function (element) {
                agreementsModal.createModal(element);
            }
        });
    }
);

