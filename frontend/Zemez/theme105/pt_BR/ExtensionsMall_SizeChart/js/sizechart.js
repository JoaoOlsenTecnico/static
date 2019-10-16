setTimeout(()=>{
  let btn = document.querySelector('#sizechartbutton'),
      modal = document.querySelector('#sizechartbox'),
      close = document.querySelector('.sizechartbox .close-sizechart'),
      overlay = document.querySelector('#sizechartbox'),
      showModal = () => modal.style.display = 'block',
      closeModal = () => modal.style.display = 'none'
  btn.removeAttribute('href')
  btn.addEventListener('click', ()=> showModal() )
  close.addEventListener('click', ()=> closeModal() )
  overlay.addEventListener('click', ()=> closeModal() )
},2500)

// require([
//     'jquery',
//     'jquery/ui',
//     'Magento_Ui/js/modal/modal'
// ], function ($) {
//     $('#sizechartbox').modal({
//         title: 'Guia de Medidas',
//         trigger: '#sizechartbutton'
//     });
//     var closestValueIndex = function (num, arr) {
//         var index = 0;
//         var curr = arr[0];
//         var diff = Math.abs(num - curr);
//         for (var val = 0; val < arr.length; val++) {
//             var newdiff = Math.abs(num - arr[val]);
//             if (newdiff < diff) {
//                 diff = newdiff;
//                 index = val;
//             }
//         }
//         return index;
//     };
//     var findSize = function () {
//         var inputs = $('#sizechart_form :input').serializeArray();
//         var sizeMatches = [];
//         $(inputs).each(function (i) {
//             var values = [];
//             var column = $('#chart_values tr td:nth-child(' + (i + 2) + ')');
//             $(column).each(function () {
//                 $(this).removeClass("current");
//                 values.push(parseFloat($(this).text(), 10));
//             });
//             var closestIndex = closestValueIndex(this.value, values);
//             sizeMatches.push(closestIndex);
//             $(column[closestIndex]).addClass("current");
//         });
//         var sizeIndex = Math.max.apply(null, sizeMatches);
//         var rows = $('#chart_values tr');
//         $(rows).removeClass("recomended-size");
//         $(rows).eq(sizeIndex).addClass("recomended-size");
//         var recomendedSize = $('#chart_values tr td:nth-child(1)').eq(sizeIndex).text();
//         $('#size-value').text(recomendedSize);
//     };
//     var convertUnits = function (unit) {
//         for (var i = 2; i <= 4; i++) {
//             var column = $('#chart_values tr td:nth-child(' + (i) + ')');
//             $(column).each(function () {
//                 $(this).removeClass("current");
//                 var value = parseFloat($(this).text(), 10);
//                 if (unit === 'in') {
//                     var converted = value / 2.54;
//                     var convertText = "Convert to Centimeters";
//                 } else {
//                     var converted = value * 2.54;
//                     var convertText = "Convert to Inches";
//                 }
//                 $(this).text(converted.toFixed(1));
//                 $("#convertsizeunits").html(convertText);
//             });
//         }
//     };
//     var changeUnits = function (event) {
//         event.preventDefault();
//         $("#sizechart_form :input").val("");
//         var cookie = $.cookie('extensionsmall_sizechart');
//         if (null !== cookie && cookie === 'in') {
//             $.cookie('extensionsmall_sizechart', 'cm');
//             convertUnits('cm');
//         } else {
//             $.cookie('extensionsmall_sizechart', 'in');
//             convertUnits('in');
//         }
//         $('#chart_values tr').removeClass("recomended-size");
//         $('#size-value').text("");
//     };
//     var getCurrentUnit = function () {
//         var cookie = $.cookie('extensionsmall_sizechart');
//         if (null !== cookie && cookie === 'in') {
//             return 'in';
//         } else {
//             return 'cm';
//         }
//     };
//     if (getCurrentUnit() === 'cm') {
//         convertUnits('cm');
//     }
//     $("#convertsizeunits").on("click", changeUnits);
//     $("#sizechart_form input").on("input", findSize);
// });
