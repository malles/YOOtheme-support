// ==UserScript==
// @name         YOOtheme support
// @namespace    http://www.bixie.nl/
// @version      0.2
// @description  supporthelper
// @author       Matthijs Alles
// @match        https://yootheme.com/support*
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

            link.href = 'https://www.nlprinters.nl/support/css/uikit.yoosupport.css';
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

    loadSupport('https://www.nlprinters.nl/support/js/yoo-support.js')
        .then(function () {
            console.log('              MM                        \n' +
                '      ZM. MMMMMMMMM.                    \n' +
                '      MMMMMMMMMMMMM                     \n' +
                '      MMMMMMMMMMMMMM                    \n' +
                '      MMMMMMMMMMMMM                     \n' +
                '        +MMMMMMMMMM                     \n' +
                '    MNMIMMMMMMMMMM                      \n' +
                '    IMMMMMMMMMMMM.                      \n' +
                '    MMMMMMMMMMM,        .MMMMM          \n' +
                '    MMMMMMMMMM?      =MMMMMMMMMMM       \n' +
                '   MMMMMMMMMMM~    MMMMMMMMMMMMMMMM     \n' +
                '  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM    \n' +
                ' =MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   \n' +
                ' DMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM  MMM   \n' +
                ' =MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   \n' +
                '  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM   \n' +
                '   ~MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM    \n' +
                '     .MMMMMMMMMMMMMM+.    +MMMMMMMM     \n' +
                '        .MMMMMMMMMO       MMMMMMMM      \n' +
                '        MMMMMMMMMMO     .MMMMMMMM~      \n' +
                '       MMMMMMMMMM~   MMMMMMMM.          \n' +
                '   MMMMMMMM.        MMMMMMMM            \n' +
                '  MMMMMMMM           DMMM7.             \n' +
                '  ~MMMM$                                ');
            console.log('Bixie Support loaded!');
        })
        .catch(function () {
            console.log('Loading Bixie Support failed!');
        });

}());