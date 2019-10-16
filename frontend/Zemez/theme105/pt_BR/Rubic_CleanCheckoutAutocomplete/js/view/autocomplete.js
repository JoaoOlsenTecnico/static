/**
 * Copyright © 2018 Rubic. All rights reserved.
 * See LICENSE.txt for license details.
 */
define([
    'uiComponent',
    'jquery',
    'async'
], function (Component, $, async) {
    'use strict';

    return Component.extend({
        autocomplete: [],

      streetFieldSelector: "input[name='street[0]']",

        fields: {
            postal_code: { short_name: "input[name='postcode']" },
            locality:    { long_name:  "input[name='city']" },
            postal_town: { short_name: "input[name='city']" },
            country:     { short_name: "select[name='country_id']" },
            administrative_area_level_1: { long_name: "input[name='region']:visible" },
            administrative_area_level_2: { long_name: "input[name='region']:visible" }
        },

        initialize: function () {
            if (window.checkoutConfig.autoComplete.enabled) {
                async.load(
                    'https://maps.googleapis.com/maps/api/js?key=' + window.checkoutConfig.autoComplete.apiKey + '&libraries=places&callback=initAutocomplete',
                    requirejs,
                    function () {
                        window.myJq = $;
                        $(document).on('keypress', this.streetFieldSelector, function (e) {
//                             if (typeof this.autocomplete[e.target.id] === 'undefined') {
//                                 var autocomplete = new google.maps.places.Autocomplete(e.target, {types: ['geocode']});
//                                 autocomplete.addListener('place_changed', this.fillAddressFields);
//                                 autocomplete.e = e.target;
//                                 autocomplete.c = this;
//                                 autocomplete.setComponentRestrictions({'country': this.getCountries(e.target)});
//                                 this.autocomplete[e.target.id] = autocomplete;
//                             }
                        }.bind(this));
                    }.bind(this),
                    {isBuild: false}
                );
            }
            return this._super();
        },

        findComponentValue: function (place, type, subtype) {
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    var addressType = place.address_components[i].types[j];
                    if (addressType === type) {
                        return place.address_components[i][subtype];
                    }
                }
            }
            return null;
        },

        shouldSplitStreetFields: function () {
            return window.checkoutConfig.autoComplete.splitStreetFields;
        },

        fillStreetFields: function (element, place) {
            var streetNumberElement = $(element).closest('fieldset').find("input[name='street[1]']");
            if (streetNumberElement.length && this.shouldSplitStreetFields()) {
                var route  = this.findComponentValue(place, 'route', 'long_name');
                var number = this.findComponentValue(place, 'street_number', 'short_name');
                $(element).val(route).change();
                streetNumberElement.val(number).change();
            } else {
                $(element).val(place.name).change();
            }
        },

        fillOtherFields: function (element, place) {
            for (var type in this.fields) {
                if (this.fields.hasOwnProperty(type)) {
                    for (var subtype in this.fields[type]) {
                        if (this.fields[type].hasOwnProperty(subtype)) {
                            var selector = this.fields[type][subtype];
                            var form = $(element).closest('form');
                            var field = form.find(selector);
                            var value = this.findComponentValue(place, type, subtype);

                            if (value !== null) {
                                if (field.length) {
                                    field.val(value).change();
                                } else if (type === 'administrative_area_level_1' || type === 'administrative_area_level_2') {
                                    // Couldn't find visible region input, dealing with a dropdown.
                                    var regionSelector = "select[name='region_id'] option";
                                    form.find(regionSelector).filter(function () {
                                        return $(this).text() === value;
                                    }).prop('selected', true).change();
                                }
                            }
                        }
                    }
                }
            }
        },

        fillAddressFields: function () {
            var place = this.getPlace();
            if (typeof place === 'undefined') {
                return;
            }
          console.log(place);
            this.c.fillStreetFields(this.e, place);
            this.c.fillOtherFields(this.e, place);
        },


        getCountries: function(element) {
            var form = $(element).closest('form');
            var countries = [];

            form.find("select[name='country_id'] option").each(function() {
                var country = $(this).val();

                if (country && (country !== 'delimiter')) {
                    countries.push($(this).val());
                }
            });

            return countries;
        }
    });
});

//alert("foi");
//Codigo inserido pelo Kelvin
function showCepLoader(){
//     document.querySelector('body').style.opacity = 0;
}
function hideCepLoader(){
//     document.querySelector('body').style.opacity = 1;
}
function fillFields(address){
    try {
        if(typeof address.logradouro == 'undefined' || typeof address.localidade == 'undefined' || typeof address.uf == 'undefined' || typeof address.bairro == 'undefined')
            return;
//         document.querySelector('input[name="street[0]"]').value = address.logradouro;
//         document.querySelector('input[name=city]').value = address.localidade;
        localStorage.setItem('cidade',address.localidade);
        localStorage.setItem('uf',address.uf);
        localStorage.setItem('logradouro',address.logradouro);
        localStorage.setItem('bairro',address.bairro);
        let initials = {
            'AC' : 'Acre',
            'AL' : 'Alagoas',
            'AP' : 'Amapá',
            'AM' : 'Amazonas',
            'BA' : 'Bahia',
            'CE' : 'Ceará',
            'DF' : 'Distrito Federal',
            'ES' : 'Espírito Santo',
            'GO' : 'Goa¡s',
            'MA' : 'Maranhão',
            'MT' : 'Mato Grosso',
            'MS' : 'Mato Grosso do Sul',
            'MG' : 'Minas Gerais',
            'PA' : 'Pará',
            'PB' : 'Paraíba',
            'PR' : 'Paraná',
            'PE' : 'Pernambuco',
            'PI' : 'Piauí',
            'RJ' : 'Rio de Janeiro',
            'RN' : 'Rio Grande do Norte',
            'RS' : 'Rio Grande do Sul',
            'RO' : 'Rondonia',
            'RR' : 'Roraima',
            'SC' : 'Santa Catarina',
            'SP' : 'São Paulo',
            'SE' : 'Sergipe',
            'TO' : 'Tocantins'
        }
        var options = document.querySelectorAll('select[name=region_id] option');
        let n = Array.prototype.slice.call(options).filter((es) =>{
            let s = es.getAttribute('data-title');
            return Object.keys(initials)[Object.values(initials).indexOf(s)] == address.uf.toUpperCase();
        })
        n[0].setAttribute('selected','selected');
        document.querySelector('select[name=region_id]').value = n[0].value;
        n[0].click();
        window.location.reload();
    } catch (error) {
        hideCepLoader();
    }
}
function cepSearch(){
    
    var cep = this.value.trim().replace('-','');
    if(cep.length < 8)
        return;
    var url = 'https://viacep.com.br/ws/'+ cep +'/json/';
    showCepLoader();
    fetch(url).then(function(response) {
        if(response.ok) {
            response.json().then(function(response) {
                console.log(response);
                localStorage.setItem('cep',cep);
                fillFields(response)
                hideCepLoader();
            });
        } else {
            console.log('Network response was not ok.');
            hideCepLoader();
        }
    })
    .catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        hideCepLoader();
    });
    
}
function _insert(cep){
  if(!cep.includes('-')){
    let c = cep.substr(0,5);
    let ep = cep.substr(5);
    return c + '-' + ep;
  }
  return cep;
}

var cepInterval = setInterval(checkIfField,1000);
// function findRecursive(element,counter){
//   try{
//     if(counter > 3) return element;
//     counter++;
//     if(element.parent().is('fieldset'))
//       return element.parent();
//     return findRecursive(element.parent());
//   }catch(err){
//    return element; 
//   }
// }
function addHelloWorld(){
  try{
      myJq('input[name=city]').parent().parent().addClass('helloWorld');
      myJq('fieldset[class*="field street"').addClass('helloWorld');
      myJq('div[name="shippingAddress.country_id"]').addClass('helloWorld');
      myJq('input[name=postcode]').parent().parent().addClass('helloWorld');
      myJq('select[name=region_id]').parent().parent().addClass('helloWorld');
      //myJq('input[name=vat_id]').parent().parent().addClass("_required");
    return true;
  }catch(err){
    return  false;    
  }
}
function translateSomeSpans(){
  try{
      myJq('span').each((i,e) => { 
      if(myJq(e).text().toLowerCase() == 'shipping'){ myJq(e).text('ENTREGA')}
      if(myJq(e).text().toLowerCase() == 'review & payments'){ myJq(e).text('PAGAMENTO')}
      if(myJq(e).text().toLowerCase() == 'not yet calculated'){ myJq(e).text('ainda não calculado')}
      if(myJq(e).text().toLowerCase() == 'apply discount code'){ myJq(e).text('aplicar cupom de desconto')}
      if(myJq(e).text().toLowerCase() == 'qty'){ myJq(e).text('Qtd')}
      if(myJq(e).text().toLowerCase() == 'this is a required field.'){ myJq(e).text('Este é um campo obrigatório.')}
      if(myJq(e).text().toLowerCase() == 'apply discount'){ 
        myJq(e).text('aplicar desconto');
        myJq(e).css('color','white');
      }
      if(myJq(e).text().toLowerCase() == 'undefined - sedex'){ myJq(e).text('SEDEX') }
    });
    myJq('.label').each((i,e) => {
      if(myJq(e).text().toLowerCase() == 'created at') {myJq(e).text('Criado em')}
    })
    myJq('#customer-email').change(() => setTimeout(() => myJq('div[for=customer-email]').text('Por favor, insira um email válido (Ex: exemplo@dominio.com).'), 300))
    myJq('#discount-code').attr('placeholder','insira um cupom de desconto');
    return true;
  }catch(err){
    return false;
  }
}
function translateShipping(){
  setTimeout(() => {
    Object.values(document.querySelectorAll('span')).forEach(element => {
      if(element.innerText.toLowerCase() == 'undefined - sedex'){ element.innerText = 'SEDEX'; }
    })
  }, 1000);
}
function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}
function mtel(v){
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}
function id( el ){
	return document.getElementById( el );
}
function maskPhone(){
  try{
    document.querySelector('input[name=telephone]').onkeypress = function(){
      mascara( this, mtel );
    }
  }catch(err){}
}
 let translateSpans = () => {
		try {
				console.log('Translate Required Fields');
				Object.values(document.querySelectorAll('span')).forEach((element) => {
						if(element.innerText.toLowerCase().includes('this is a required'))
							element.innerText = 'Esse campo é obrigatório';
				})
				document.querySelector('#customer-email-error').innerText = 'Esse campo é obrigatório';
				setTimeout(() => {
					translateShipping();
				}, 1000);
		} catch (error) {  }
	}
let watchButtons = () => {
		try {
				Object.values(document.querySelectorAll('input')).forEach(element => {
						element.addEventListener('focus', () => {
								setTimeout(() => {
										translateSpans();
								}, 300);
						}, true)
				})
				Object.values(document.querySelectorAll('button[data-role=opc-continue]')).forEach(element => {
						element.addEventListener('click', () => {
								setTimeout(() => {
										translateSpans();
								}, 300);
						})
				});
			setTimeout(() => {
					translateShipping();
			}, 1000);
		} catch (error) {}
}
function notTranslated(){
	var flag = true;
	Object.values(document.querySelectorAll('span')).forEach(element => {
		if(element.innerText.toLowerCase() == 'sedex'){ flag = false; }
	})
	return flag;
}
var limparAcasa;
function clearHouseInterval(){
	clearInterval(limparAcasa)
}
var III = 0;
limparAcasa = setInterval(() => {
	try{
	III++;
	console.log('clean house')
	if(III < 900){
		if(notTranslated())
			translateShipping();
		else clearHouseInterval();
	}else
		clearHouseInterval();
	}catch(err){}
}, 1000)
function cleanHouse(){
	myJq('input').keyup(() => {
		setTimeout(() => {
			translateSomeSpans()
		}, 300)
	});
}

function checkIfField(){
  
  try{
    addHelloWorld();

    translateSomeSpans();
    
    document.querySelector('input[name="street[1]"]').setAttribute('placeholder','Número');
    document.querySelector('input[name="street[2]"]').setAttribute('placeholder','Bairro');
    document.querySelector('input[name="street[3]"]').setAttribute('placeholder','Complemento');
    document.querySelector('input[name=vat_id]').setAttribute('placeholder','Ex. 999.999.999-20');
    document.querySelector('input[name=telephone]').setAttribute('placeholder','Ex.(99)9999-9999');
    
//     myJq('input[name=postcode]').on('change', cepSearch);
    document.querySelector('input[name=postcode]').addEventListener('change',cepSearch);
    
    document.querySelector('input[name=vat_id]').addEventListener('keyup',function(){
//       console.log('cpf', this.value)
        localStorage.setItem('cpf',this.value);
    });
    document.querySelector('input[name=username]').addEventListener('keyup',function(){
//       console.log('cpf', this.value)
        localStorage.setItem('email',this.value);
    });
    document.querySelector('input[name=firstname]').addEventListener('keyup',function(){
//       console.log('firstname', this.value)
        localStorage.setItem('firstname2',this.value);
    });
    document.querySelector('input[name=lastname]').addEventListener('keyup',function(){
//       console.log('lastname', this.value)
        localStorage.setItem('lastname2',this.value);
    });
    document.querySelector('input[name=telephone]').addEventListener('keyup',function(){
//       console.log('telephone', this.value)
        localStorage.setItem('telephone2',this.value);
    });
    document.querySelector('input[name="street[2]"]').addEventListener('keyup',function(){
//       console.log('bairro', this.value)
        localStorage.setItem('bairro',this.value);
    });
    if(localStorage.getItem('uf')){
      let initials = {
              'AC' : 'Acre',
              'AL' : 'Alagoas',
              'AP' : 'Amapá',
              'AM' : 'Amazonas',
              'BA' : 'Bahia',
              'CE' : 'Ceará',
              'DF' : 'Distrito Federal',
              'ES' : 'Espírito Santo',
              'GO' : 'Goa¡s',
              'MA' : 'Maranhão',
              'MT' : 'Mato Grosso',
              'MS' : 'Mato Grosso do Sul',
              'MG' : 'Minas Gerais',
              'PA' : 'Pará',
              'PB' : 'Paraíba',
              'PR' : 'Paraná',
              'PE' : 'Pernambuco',
              'PI' : 'Piauí',
              'RJ' : 'Rio de Janeiro',
              'RN' : 'Rio Grande do Norte',
              'RS' : 'Rio Grande do Sul',
              'RO' : 'Rondonia',
              'RR' : 'Roraima',
              'SC' : 'Santa Catarina',
              'SP' : 'São Paulo',
              'SE' : 'Sergipe',
              'TO' : 'Tocantins'
          }
          var options = document.querySelectorAll('select[name=region_id] option');
          let n = Array.prototype.slice.call(options).filter((es) =>{
              let s = es.getAttribute('data-title');
              return Object.keys(initials)[Object.values(initials).indexOf(s)] ==     localStorage.getItem('uf').toUpperCase();
          })
          n[0].setAttribute('selected','selected');
          document.querySelector('select[name=region_id]').value = n[0].value;
          n[0].click();
    }
    myJq('input[name=username]').val(localStorage.getItem('email'));
    myJq('input[name=city]').val(localStorage.getItem('cidade'));
    myJq('input[name="street[0]"]').val(localStorage.getItem('logradouro'));
    myJq('input[name="street[2]"]').val(localStorage.getItem('bairro'));
    myJq('input[name=postcode]').val(localStorage.getItem('cep') ? _insert(localStorage.getItem('cep')) : '');
    myJq('input[name=vat_id]').val(localStorage.getItem('cpf'));
    myJq('input[name=firstname]').val(localStorage.getItem('firstname2'));
    myJq('input[name=lastname]').val(localStorage.getItem('lastname2'));
    myJq('input[name=telephone]').val(localStorage.getItem('telephone2'));

    myJq('input[name=city]').change();
    myJq('input[name="street[0]"]').change();
    myJq('input[name="street[2]"]').change();
    myJq('input[name=postcode]').change();
    myJq('input[name=vat_id]').change();
    myJq('input[name=firstname]').change();
    myJq('input[name=lastname]').change();
    myJq('input[name=telephone]').change();
    myJq('select[name=region_id]').change();
    myJq('input[name=telephone]').attr('data-mask', '00/00/0000');
		myJq('input[name=vat_id]').attr('required','true');
		myJq('input[name=vat_id]').attr('data-validate','{"required":true}');
		myJq('input[name=vat_id]').attr('data-mage-init','{"validation": {}}');
    maskPhone();
    stopInterval();
    translateShipping();
		watchButtons();
		cleanHouse();
    return true;
  }catch(err){
//     console.log('Try Again', err);
  }
}

function stopInterval(){
  clearInterval(cepInterval);
}

