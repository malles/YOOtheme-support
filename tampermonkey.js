// ==UserScript==
// @name         YOOtheme support
// @namespace    http://www.bixie.nl/
// @version      0.1
// @description  supporthelper
// @author       Matthijs Alles
// @match        http://yootheme.com/support*
// @grant        none
// ==/UserScript==
(function () {
    "use strict";

    function loadSupport(url) {
        return new Promise(function (resolve, reject) {
            //css
            var link = document.createElement('link');

            link.onerror = function () {
                console.log('Error loading CSS!');
            };

            link.href = 'http://yoo.bixie.nl/support/css/uikit.yoosupport.css';
            link.type = 'text/css';
            link.rel = 'stylesheet';

            document.getElementsByTagName('head')[0].appendChild(link);

            //js
            var script = document.createElement('script');

            script.onload = function () {
                resolve(url);
            };
            script.onerror = function () {
                reject(url);
            };
            script.src = url;

            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }

    loadSupport('http://yoo.bixie.nl/support/js/yoo-support.js')
        .then(function () {
            console.log('Bixie Support loaded!');
        })
        .catch(function () {
            console.log('Loading Bixie Support failed!');
        });

}());
