/**
 * Copyright © 2015. All rights reserved.
 */

define([
    'jquery',
    'blogOwlCarousel'
], function($){
    "use strict";

    $.widget('TemplateMonster.blogCarousel', {

        options: {
            responsive : {
                0 : {
                  items: 1
                },
                450 : {
                  items: 2
                },
                767 : {
                  items: 3
                },
                1439 : {
                  items: 4
                }
            },
            autoPlay: false,
            nav:true,
            navText: [],
            dots: false
        },

        _create: function() {
          var $owl = this.element.owlCarousel(this.options);

          $('body').on('rtlEnabled', function () {
            $owl.data('owl.carousel').options.rtl = true;
            $owl.trigger( 'refresh.owl.carousel' );
          });
        }
        
    });

    return $.TemplateMonster.blogCarousel;

});
