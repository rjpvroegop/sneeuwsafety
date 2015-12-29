$(document).ready(function(){
    init();
});

var start = 0;
var end = 0;
var pieper = 0;
var schep = 0;
var sonde = 0;
var tas = 0;
var tasMee = false;
var dagen = 1;
var borg = 0;
var verzend = 7.5;
var sub = function(){return (pieper + schep + sonde + tas) * dagen};
var total = function(){return ((pieper + schep + sonde + tas) * dagen) + verzend};
var startPicker = startDatepicker.pickadate('picker')
var endPicker = endDatePicker.pickadate('picker')


function init(){
    var now = new Date(Date.now);
    startPicker.set('select', now);
    endPicker.set('select', now);

    $('.picker__holder').click(function(){
        start = new Date(startPicker.get('select', 'yyyy/mm/dd'));
        end = new Date(endPicker.get('select', 'yyyy/mm/dd'));
        var msToDays = (function(timeMs){return timeMs  / 1000 / 60 / 60 / 24 + 1});

        var msNegative = start - end; //negative value
        var ms = msNegative * -1; // positive value
        dagen = msToDays(ms);

        show();

        console.log(dagen);
    })
}

function show(){
    if(tasMee)
        pieper != 0 && sonde != 0 && schep != 0 ? tas = 0 : tas = 0.5;
    else
        tas = 0;

    $('.overzicht .beacon .right').html('&euro;' + (pieper * dagen).toFixed(2));
    $('.overzicht .sondeerstok .right').html('&euro;' + (sonde * dagen).toFixed(2));
    $('.overzicht .shuffle .right').html('&euro;' + (schep * dagen).toFixed(2));
    $('.overzicht .backpack .right').html('&euro;' + (tas * dagen).toFixed(2));
    $('.overzicht .verzendkosten .right').html('&euro;' + (verzend).toFixed(2));
    $('.overzicht .borg .right').html('&euro;' + (borg).toFixed(2));
    $('.overzicht .subtotaal .right').html('&euro;' + sub().toFixed(2));
    $('.overzicht .totaal .right').html('&euro;' + total().toFixed(2));

    (pieper != 0 ? $('.overzicht .beacon').slideDown() : $('.overzicht .beacon').slideUp());
    (sonde != 0 ? $('.overzicht .sondeerstok').slideDown() : $('.overzicht .sondeerstok').slideUp());
    (schep != 0 ? $('.overzicht .shuffle').slideDown() : $('.overzicht .shuffle').slideUp());

    $('.overzicht .verzendkosten').slideDown();
    $('.overzicht .borg').slideDown();
}

function toggle_beacon(checker){
    if(checker.checked) {
        borg += 150;
        pieper = 4;
    }
    else {
        borg -= 150;
        pieper = 0;
    }
    show();
}

function toggle_backpack(checker){
    tasMee = checker.checked;
    show();
    (checker.checked ? $('.overzicht .backpack').slideDown() : $('.overzicht .backpack').slideUp());
}

function toggle_sondeerstok(checker){
    if(checker.checked) {
        borg += 20;
        sonde = 0.5;
    }
    else {
        borg -= 20;
        sonde = 0;
    }
    show();
}

function toggle_shuffle(checker){
    if(checker.checked) {
        borg += 20;
        schep = 0.5;
    }
    else {
        borg -= 20;
        schep = 0;
    }
    show();
}