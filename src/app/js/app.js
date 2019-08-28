window.Poper = require('popper.js').default;

try {
    window.$ = window.jQuery = require('jquery');
    require('bootstrap');    
} catch (e) {
    console.log("Specified file cannot be found: " + e);
}


