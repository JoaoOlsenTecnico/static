(function () {
    'use strict';

    /**
     * Translator for documentation pages.
     *
     * To enable translation you should include one of language-files in your index.html
     * after <script src='lang/translator.js' type='text/javascript'></script>.
     * For example - <script src='lang/ru.js' type='text/javascript'></script>
     *
     * If you wish to translate some new texsts you should do two things:
     * 1. Add a new phrase pair ("New Phrase": "New Translation") into your language file (for example lang/ru.js).
     * It will be great if you add it in other language files too.
     * 2. Mark that text it templates this way <anyHtmlTag data-sw-translate>New Phrase</anyHtmlTag>
     * or <anyHtmlTag data-sw-translate value='New Phrase'/>.
     * The main thing here is attribute data-sw-translate.
     * Only inner html, title-attribute and value-attribute are going to translate.
     */
    window.SwaggerTranslator = {
        _words: [],

        /** @function translate */
        translate: function (sel) {
            var $this = this;

            sel = sel || '[data-sw-translate]';

            Array.prototype.slice.call(document.querySelectorAll(sel)).forEach(function (elem) {
                elem.innerHTML = $this._tryTranslate(elem.innerHTML);
                elem.value = $this._tryTranslate(elem.value);
                elem.setAttribute('title', $this._tryTranslate(elem.getAttribute('title')));
            });
        },

        /** @function translate */
        _tryTranslate: function (word) {
            word = word || '';

            return this._words[word.trim()] !== undefined ? this._words[word.trim()] : word;
        },

        /** @function learn */
        learn: function (wordsMap) {
            this._words = wordsMap;
        }
    };
})();
