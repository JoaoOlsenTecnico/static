 require(["jquery"], function (jQuery) {
	jQuery(document).on('click', 'a.itemPopupImage', function () { 
	    var openModal=jQuery(this).attr('data-id');
	     jQuery('#wrapper-'+openModal).addClass('modal-opened');
	     jQuery("#productpersonalized-"+openModal).responsiveSlides({
			auto: false,
			pager: false,
			nav: true,
			speed: 500,
			namespace: "callbacks",
			before: function () {
			},
			after: function () {
			}
		});
	});
	jQuery(document).on('click', 'a.close-modal', function () { 
	    var closeModal=jQuery(this).attr('id');
	     jQuery('#wrapper-'+closeModal).removeClass('modal-opened');
	});
});