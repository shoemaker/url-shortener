'use strict';

/* App Module */

angular.module('urlApp', ['urlServices']);

$('txtUrl').val('');
$('#txtShortUrl').val('');

$('#btnNew').click(function() {
    $('#txtUrl').val('');
});

$('#txtUrl').keypress(function(e) {
    if(e.which == 13) { 
        $('#btnNew').click();
    }
});

$('#txtUrl').focus();
