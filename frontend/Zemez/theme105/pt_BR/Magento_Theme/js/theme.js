define([
    'jquery',
    'underscore',
    'mage/template',
    'text!ui/template/modal/modal-popup.html',
    'text!ui/template/modal/modal-slide.html',
    'text!ui/template/modal/modal-custom.html',
    'Magento_Ui/js/lib/key-codes',
    'mage/smart-keyboard-handler',
    'jquery/ui',
    'mage/mage',
    'mage/ie-class-fixer',
    'carouselInit',
    'blockCollapse',
    'animateNumber',
    'selectize',
    'doubleTap',
    'tiltJs'
], function ($) {
    'use strict';

    $.widget('TemplateMonster.theme', {

        options: {
            relatedCarousel: {
                selector: ".catalog-product-view .block.related .product-items",
                params: {
                    dots: false,
                    items: 3,
                    responsive: {
                        0: {
                            items: 1
                        },
                        480: {
                            items: 2
                        },
                        768: {
                            items: 3
                        },
                        1024: {
                            items: 4
                        },
                        1440: {
                            items: 5
                        }
                    }
                }
            },
            upsellCarousel: {
                selector: ".catalog-product-view .block.upsell .product-items",
                params: {
                    dots: false,
                    items: 3,
                    responsive: {
                        0: {
                            items: 1
                        },
                        480: {
                            items: 2
                        },
                        768: {
                            items: 3
                        },
                        1024: {
                            items: 4
                        },
                        1440: {
                            items: 5
                        }
                    }
                }
            },
            crosssellCarousel: {
                selector: ".block.crosssell .product-items",
                params: {}
            },
            animatedCounter: {
                selector: ".skills .number",
                speed: 2000
            },
            testimonialsCarousel: {
                selector: ".owl-testimonials",
                params: {
                    loop: true,
                    dotsSpeed: true,
                    nav: false,
                    items: 1,
                    responsive: {
                        0: {
                            items: 1
                        },
                        480: {
                            items: 1
                        },
                        768: {
                            items: 1
                        },
                        1024: {
                            items: 1
                        }
                    }
                }
            },
            customSelect: {
                selector: "#product-review-container select, .toolbar-posts select, .account .main select, .product-options-wrapper .date select, #product-options-wrapper select.admin__control-select, #quick-search-type-id, #product-review-container .review-toolbar select, .search.advanced .brand_id select"
            }
        },

// Magento blank theme theme.js

        _checkoutCollapsible: function() {
            if ($('body').hasClass('checkout-cart-index')) {
                if ($('#co-shipping-method-form .fieldset.rates').length > 0 &&
                    $('#co-shipping-method-form .fieldset.rates :checked').length === 0
                ) {
                    $('#block-shipping').on('collapsiblecreate', function () {
                        $('#block-shipping').collapsible('forceActivate');
                    });
                }
            }
        },

// Magento blank theme theme.js end

        _sidebarCollapsible: function(){
            /* Sidebar block collapse in mobile */
            var block = $(".sidebar-additional .block");
            if(block.length > 0) {
                block.sidebarCollapse();
            }
        },

        _initProductsCarousel: function (selector) {
            var limit = $(selector).data('limit'),
                itemsCount = 1;
            if (limit != 0) {
                $('.product-item', selector).each(function(){
                    if (itemsCount > limit){
                        $(this).remove();
                    }
                    itemsCount++;
                });
            }
        },

        _productsCarousel: function () {
            /* Related init */
            var relatedCarouselData = this.options.relatedCarousel;
            this._initProductsCarousel('.catalog-product-view .block.related');
            $(relatedCarouselData.selector).carouselInit(relatedCarouselData.params);

            /* Upsell init */
            var upsellCarouselData = this.options.upsellCarousel;
            this._initProductsCarousel('.catalog-product-view .block.upsell');
            $(upsellCarouselData.selector).carouselInit(upsellCarouselData.params);

            /* Crosssell init */
            var crosssellCarouselData = this.options.crosssellCarousel;
            $(crosssellCarouselData.selector).carouselInit(crosssellCarouselData.params);
        },

        _animatedCounter: function(){
            var animatedCounterData = this.options.animatedCounter;
            var number = $(animatedCounterData.selector);
            if(number.length > 0){
                number.each(function(){
                    var finish = $(this).data('finish');
                    $(this).animateNumber({ number: finish }, animatedCounterData.speed);
                })
            }
        },

        _testimonialsCarousel: function(){
            var testimonialsData = this.options.testimonialsCarousel;
            $(testimonialsData.selector).carouselInit(testimonialsData.params);
        },

        _messageClear: function(){
            $(document).on('click', '.page-main .page.messages .message', function(){
                $(this).hide();
            });
        },

        _customSelect: function(){
            var customSelectData = this.options.customSelect;
            $(customSelectData.selector).selectize();
        },

        _faqAccordion: function () {
            $("#faq-accordion .accordion-trigger").click(function() {
                var _accTrigger = $(this);
                var _accBlock = $(_accTrigger).parent(".accordion-block");
                var _accContent = $(_accBlock).find(".accordion-content");

                if ( $(_accTrigger).hasClass( "close" ) ) {
                    $(this).removeClass("close").addClass("open");
                    $(_accBlock).removeClass("close").addClass("open");
                    $(_accContent).slideDown();
                }else{
                    $(this).removeClass("open").addClass("close");
                    $(_accBlock).removeClass("open").addClass("close");
                    $(_accContent).slideUp();
                }
            });
        },

        _doubleTapInit: function () {
            var testExp = new RegExp('Android|webOS|' +
                'BlackBerry|Windows Phone|'  +
                'Opera Mini|IEMobile|Mobile' ,
                'i');
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            if (!iOS){
                setTimeout(function () {
                    $( '.tm-top-navigation li.parent' ).doubleTapToGo();
                }, 1000);
            }
        },

        _focusSearchInput: function () {
            $("#search_mini_form .search .label").click(function () {
                function clickSearchToggle() {
                    $("#search").focus();
                };
                setTimeout(clickSearchToggle, 300);
            })
        },

        _customLabelFocus: function () {
            var _inputSelector = $(".custom-label .control input");

            $($(_inputSelector)).each(function() {
                if($(this).val()){
                    $(this).parents(".custom-label").addClass("focus");
                }
            });

            $(document).on( "focus", ".custom-label .control input" ,function () {
                var _this = $(this);
                var _inputField = $(_this).parents(".custom-label");

                if(!$(_inputField).hasClass("focus")){
                    $(_inputField).addClass("focus")
                }
            });

            $(document).on( "focusout", ".custom-label .control input" ,function () {
                var _this = $(this);
                var _inputField = $(_this).parents(".custom-label");

                if($(_inputField).hasClass("focus") && !$(_this).val()){
                    $(_inputField).removeClass("focus")
                }
            });
        },

        _dataItemsScroll: function () {
            $('.data.item.title').click(function(evt) {
                var _tabTitle = $(this);
                setTimeout(function () {
                    var _thisOffset = $(_tabTitle).offset().top - 61;
                    evt.preventDefault();

                    $('html, body').stop().animate({
                        scrollTop: _thisOffset,
                    }, 300);
                }, 200);
            });
        },

        _wishlistOptionsDropdown: function () {
            $( ".products-grid.wishlist .product-item-tooltip .content" ).dropdownDialog({
                appendTo: ".products-grid.wishlist .product-item-tooltip",
                triggerTarget: ".products-grid.wishlist .product-item-tooltip .toggle",
                closeOnMouseLeave: false,
                closeOnClickOutside: true,
                parentClass: "active",
                triggerClass: "active"
            });
        },

        _megamenuParentClass: function () {
            var megaMenu = $( ".megamenu-wrapper" );
            if (megaMenu.length) {
                megaMenu.parent().addClass("megamenu-wrapper-parent");
            }
        },

        _smartHeader: function () {
            $( ".sm-header-nav-wrap__topnav .navigation" ).dropdownDialog({
                appendTo: ".sm-header-nav-wrap__topnav",
                triggerTarget: ".sm-header-nav-toggle",
                defaultDialogClass: "sm-header-menu-wrap",
                closeOnMouseLeave: false,
                closeOnClickOutside: true,
                parentClass: "open",
                triggerClass: "open",
                position: { my: "left top", at: "left bottom", of: "sm-header-nav-toggle" }
            });

            $( ".sm-header_customer-menu" ).dropdownDialog({
                appendTo: ".sm-header_customer-menu-container",
                triggerTarget: ".sm-header_customer-menu-toggle",
                defaultDialogClass: "sm-header_customer-menu-wrap",
                closeOnMouseLeave: false,
                closeOnClickOutside: true,
                parentClass: "open",
                triggerClass: "open",
                position: { my: "right top", at: "right bottom", of: "sm-header_customer-menu-container" }
            });

            $( "#search_mini_form .search .control" ).dropdownDialog({
                appendTo: "#search_mini_form .search",
                triggerTarget: "#search_mini_form .search .label",
                defaultDialogClass: "search-control_wrapper",
                closeOnMouseLeave: false,
                closeOnClickOutside: true,
                parentClass: "open",
                triggerClass: "open"
            });

            $("body header.page-header").append('<div id="page-overlay"></div>');

            $(".sm-header-nav-toggle").click(function () {
                var _smHeaderNavToggle = $(this);
                if((_smHeaderNavToggle).hasClass('open')){
                    $('#page-overlay').addClass('page-overlay');

                    if($(".sm-header_customer-menu-container").hasClass('open')){
                        $(".sm-header_customer-menu").dropdownDialog("close");
                    }
                    if($(".block-search .field.search").hasClass('open')){
                        $(".search-control_wrapper .control").dropdownDialog("close");
                    }
                    if($(".page-header__content .minicart-wrapper").hasClass('active')){
                        $('[data-role="dropdownDialog"]').dropdownDialog("close");
                    }
                    if($(".layout-switcher").hasClass('on')){
                        $('.layout-switcher').removeClass("on");
                        $('#ls-icon').removeClass("fa-close").addClass("fa-cogs");
                    }
                } else {
                    $('#page-overlay').removeClass('page-overlay');
                }
            });
            $(".sm-header_customer-menu-toggle").click(function () {
                var _smHeaderCustomerMenuToggle = $(this);
                if((_smHeaderCustomerMenuToggle).hasClass('open')){
                    $('#page-overlay').addClass('page-overlay');

                    if($(".sm-header-nav-wrap__topnav").hasClass('open')){
                        $(".sm-header-nav-wrap__topnav .navigation").dropdownDialog("close");
                    }
                    if($(".block-search .field.search").hasClass('open')){
                        $(".search-control_wrapper .control").dropdownDialog("close");
                    }
                    if($(".page-header__content .minicart-wrapper").hasClass('active')){
                        $('[data-role="dropdownDialog"]').dropdownDialog("close");
                    }
                    if($(".layout-switcher").hasClass('on')){
                        $('.layout-switcher').removeClass("on");
                        $('#ls-icon').removeClass("fa-close").addClass("fa-cogs");
                    }
                    $(".sm-header_customer-menu-wrap .action.close").click(function () {
                        $('#page-overlay').removeClass('page-overlay');
                    });
                }
            });
            $(".page-header__content .action.showcart").click(function () {
                var _pageHeaderContentActionShowcart = $(this);
                if(!(_pageHeaderContentActionShowcart).hasClass('open')){
                    $('#page-overlay').addClass('page-overlay');

                    if($(".sm-header-nav-wrap__topnav").hasClass('open')){
                        $(".sm-header-nav-wrap__topnav .navigation").dropdownDialog("close");
                    }
                    if($(".block-search .field.search").hasClass('open')){
                        $(".search-control_wrapper .control").dropdownDialog("close");
                    }
                    if($(".sm-header_customer-menu-container").hasClass('open')){
                        $(".sm-header_customer-menu").dropdownDialog("close");
                    }
                    if($(".layout-switcher").hasClass('on')){
                        $('.layout-switcher').removeClass("on");
                        $('#ls-icon').removeClass("fa-close").addClass("fa-cogs");
                    }
                    $("#btn-minicart-close, #btn-minicart-close-button").click(function () {
                        $('#page-overlay').removeClass('page-overlay');
                    });
                }
            });

            $("#search_mini_form .search .label").click(function () {
                var _searchMiniFormSearchLabel = $(this);
                if((_searchMiniFormSearchLabel).hasClass('open')){
                    $('#page-overlay').addClass('page-overlay');

                    if($(".sm-header-nav-wrap__topnav").hasClass('open')){
                        $(".sm-header-nav-wrap__topnav .navigation").dropdownDialog("close");
                    }
                    if($(".sm-header_customer-menu-container").hasClass('open')){
                        $(".sm-header_customer-menu").dropdownDialog("close");
                    }
                    if($(".page-header__content .minicart-wrapper").hasClass('active')){
                        $('[data-role="dropdownDialog"]').dropdownDialog("close");
                    }
                    if($(".layout-switcher").hasClass('on')){
                        $('.layout-switcher').removeClass("on");
                        $('#ls-icon').removeClass("fa-close").addClass("fa-cogs");
                    }
                } else {
                    $('#page-overlay').removeClass('page-overlay');
                }
            });

            $(".layout-switcher #ls-icon").click(function () {
                setTimeout(function() {
                    if ($('.layout-switcher').hasClass('on')) {
                        $('#page-overlay').addClass('page-overlay');
                    } else {
                        $('#page-overlay').removeClass('page-overlay');
                    }
                });
            });

            $("#page-overlay").click(function () {
                $('#page-overlay').removeClass('page-overlay');
                $('.page-overlay').removeClass('page-overlay');
                $('.layout-switcher').removeClass('on');
                $('#ls-icon').removeClass('fa-close').addClass('fa-cogs');
            });

            if ($(".slider-under-menu").length) {
                $(".page-wrapper").addClass('page-wrapper-header-absolute');
            }

            if ($(".minicart-wrapper").length) {
                $('#page-overlay').removeClass('page-overlay');
            } else if ($(".minicart-wrapper").hasClass('active')) {
                $('#page-overlay').addClass('page-overlay');
            }

            $(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    if (!$('.field.search').hasClass('open')) {
                        $('#page-overlay').removeClass('page-overlay');
                    }
                    if ($('.sm-header-nav-wrap').hasClass('open')) {
                        $('.sm-header-nav-wrap').removeClass('open');
                        $('.sm-header-nav-toggle').removeClass('open');
                    }
                    if ($('.layout-switcher').hasClass('on')) {
                        $('.layout-switcher').removeClass('on');
                        $('#ls-icon').removeClass('fa-close').addClass('fa-cogs');
                    }
                    if ($('.minicart-wrapper').hasClass('active')) {
                        $('.minicart-wrapper').removeClass('active');
                        $('.minicart-wrapper .action.showcart').removeClass('active');
                    }
                    if ($('.modal-popup').hasClass('_show')) {
                        $('.modal-popup').removeClass('_show');
                        $('.modals-overlay').remove();
                    }
                }
            });

            $(document).on('ajaxComplete', function () {
                $("#btn-minicart-close-button").click(function () {
                    $('#page-overlay').removeClass('page-overlay');
                });
            });
        },

        _tiltJsTheme: function() {
            $('.category-link').tilt({
                maxTilt: 15,
                perspective: 600,
                speed: 800,
                transition: true
            })
        },

        _create: function() {
            this._checkoutCollapsible();
            this._sidebarCollapsible();
            this._productsCarousel();
            this._animatedCounter();
            this._testimonialsCarousel();
            this._messageClear();
            this._customSelect();
            this._faqAccordion();
            this._doubleTapInit();
            this._focusSearchInput();
            this._customLabelFocus();
            this._dataItemsScroll();
            this._wishlistOptionsDropdown();
            this._megamenuParentClass();
            this._smartHeader();
            this._tiltJsTheme();
        }
    });

    return $.TemplateMonster.theme;
 
});