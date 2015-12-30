$(document).ready(function(){
    initshop();
});

var pieper = false;
var shovel = false;
var sonde = false;
var bag = false;
var discount = false;
var startdatum = '';
var einddatum = '';
var dagen = 1;
var tweePers = $('#personen').prop('checked');

var naam = '';
var straat = '';
var postcode = '';
var huisnummer = '';
var toevoeging = '';
var plaats = '';
var mail = '';
var telefoon = '';

var bedragen = {
    pieper:4,
    shovel:0.5,
    sonde:0.5,
    bag:0.5,
    send:7.5
};

var startPicker = startDatepicker.pickadate('picker')
var endPicker = endDatePicker.pickadate('picker')

function initshop(){
    var now = new Date(Date.now);
    startPicker.set('select', now);
    endPicker.set('select', now);
    startdatum = new Date(startPicker.get('select', 'yyyy/mm/dd'));
    einddatum = new Date(endPicker.get('select', 'yyyy/mm/dd'));
    $('.gegevens').hide();
    $('#bedankt').hide();
    showorhideshop();
    update_shop();

    $('.picker__holder').click(function(){
        calculate_days();
    });

    $('.no').click(function(){
        deactivate($(this));
    });

    $('.yes').click(function(){
        activate($(this));
    });

    $('#personen').click(function() {
        tweePers = $(this).prop('checked');
        update_shop();
    });
}

function calculate_days(){
    startdatum = new Date(startPicker.get('select', 'yyyy/mm/dd'));
    einddatum = new Date(endPicker.get('select', 'yyyy/mm/dd'));
    var msToDays = (function(timeMs){return timeMs  / 1000 / 60 / 60 / 24 + 1});

    var msNegative = startdatum - einddatum; //negative value
    var ms = msNegative * -1; // positive value
    dagen = msToDays(ms);
    update_shop();
}

function activate(selector){
    console.log(selector.attr("data-rental"));
    $("div[data-rental*="+ selector.attr("data-rental") +"]").removeClass('selected')
    selector.addClass('selected');

    if(selector.attr("data-rental") == 'pieper'){
        pieper = true;
    } else if(selector.attr("data-rental") == 'shovel'){
        shovel = true;
    } else if (selector.attr("data-rental") == 'sonde'){
        sonde = true;
    } else {
        bag = true;
    }
    if (pieper && shovel && bag && sonde){
        discount = true;
    }
    update_shop();
}

function deactivate(selector){
    console.log(selector.attr("data-rental"));
    $("div[data-rental*="+ selector.attr("data-rental") +"]").removeClass('selected')
    selector.addClass('selected');

    if(selector.attr("data-rental") == 'pieper'){
        pieper = false;
    } else if( selector.attr("data-rental") == 'shovel'){
        shovel = false;
    } else if (selector.attr("data-rental") == 'sonde'){
        sonde = false;
    } else {
        bag = false;
    }
    discount = false;

    update_shop();
}

function update_shop(){

    $('.discount .right').html('-&euro;' + (0.5 * (tweePers ? 2 : 1) * dagen).toFixed(2));
    if (pieper && shovel && bag && sonde){
        $('.discount').slideDown();
    } else {
        $('.discount').slideUp();
    }

    if(pieper)
        $('.beacon .right').html('&euro;' + (dagen * bedragen.pieper * (tweePers ? 2 : 1)).toFixed(2));
    else
        $('.beacon .right').html('&euro;0');
    if(shovel)
        $('.shovel .right').html('&euro;' + (dagen * bedragen.shovel * (tweePers ? 2 : 1)).toFixed(2));
    else
        $('.shovel .right').html('&euro;0');
    if(sonde)
        $('.sondeerstok .right').html('&euro;' + (dagen * bedragen.sonde * (tweePers ? 2 : 1)).toFixed(2));
    else
        $('.sondeerstok .right').html('&euro;0');
    if(bag)
        $('.backpack .right').html('&euro;' + (dagen * bedragen.bag * (tweePers ? 2 : 1)).toFixed(2));
    else
        $('.backpack .right').html('&euro;0');

    $('.dagen .right').html(dagen);

    $('.subtotaal .right').html('&euro;' + subtotaal().toFixed(2));

    $('.verzendkosten .right').html('&euro;' + bedragen.send.toFixed(2));

    $('.borg .right').html('&euro;' + borg().toFixed(2));

    $('.totaal .right').html('&euro;' + totaal().toFixed(2));

    showorhideshop();
}

function showorhideshop(){
    (pieper ? $('.beacon').slideDown() : $('.beacon').slideUp());
    (shovel ? $('.shovel').slideDown() : $('.shovel').slideUp());
    (sonde ? $('.sondeerstok').slideDown() : $('.sondeerstok').slideUp());
    (bag ? $('.backpack').slideDown() : $('.backpack').slideUp());

    (pieper || shovel || sonde ?
        $('.borg').slideDown() && $('.verzendkosten').slideDown() :
        $('.borg').slideUp() && $('.verzendkosten').slideUp())

    discount ?
        $('.discount').slideDown() :
        $('.discount').slideUp();
}

var subtotaal = (function(){
    var value =
        (pieper ? bedragen.pieper * dagen : 0) +
        (shovel ? bedragen.shovel * dagen : 0) +
        (sonde ? bedragen.sonde * dagen : 0) +
        (bag ? bedragen.bag * dagen : 0);

    return value * (tweePers ? 2 : 1);
});

var totaal = (function(){
    var value = subtotaal() +
        (pieper || shovel || sonde || bag ? bedragen.send : 0) +
        (discount ? (-0.5 * (tweePers ? 2 : 1) * dagen) : 0);

    return value;
});

var borg = (function(){
    var value =
        (pieper ? 150 : 0) +
        (shovel ? 25 : 0) +
        (sonde ? 25 : 0);

    return value * (tweePers ? 2 : 1);
});


var sendForm = (function(){
    if($('#voornaam').val())
        naam = $('#voornaam').val();
    else {
        naam = false;
        $('#voornaam').css({background:'pink'})
    }
    if($('#achternaam').val())
        naam = naam + " " + $('#achternaam').val();
    else {
        naam = false;
        $('#achternaam').css({background:'pink'})
    }
    mail = $('#orderemail').val() || false;
    telefoon = $('#telephone').val() || false;
    straat = $('#straat').val() || false;
    postcode = $('#postcode').val() || false;
    huisnummer = $('#huisnummer').val() || false;
    toevoeging = $('#toevoeging').val() || false;
    plaats = $('#plaats').val() || false;

    var data = {
        naam:naam, email:mail, telefoon:telefoon,
        straat:straat, postcode:postcode, huisnummer:huisnummer,
        toevoeging:toevoeging, plaats:plaats, schep:shovel, pieper:pieper, sonde:sonde,
        tas:bag, start:startdatum, eind:einddatum, tweePers:(tweePers ? 2 : 1)
    };

    mail || $('#orderemail').css({background:'pink'});
    telefoon || $('#telephone').css({background:'pink'});
    straat || $('#straat').css({background:'pink'});
    plaats || $('#plaats').css({background:'pink'});
    postcode || $('#postcode').css({background:'pink'});
    huisnummer || $('#huisnummer').css({background:'pink'});
    toevoeging || $('#toevoeging').css({background:'pink'});

    if(!sonde && !shovel && !pieper && bag)
        Materialize.toast('Helaas verhuren wij geen losse tas.', 4000)
    if(!sonde && !shovel && !pieper)
        Materialize.toast('Selecteert u alstublieft een product.', 4000)

    if(naam && mail && telefoon && straat && postcode && huisnummer && plaats && (
            shovel || sonde || pieper)) {
        $.ajax({
            method: "GET",
            url: "http://127.0.0.1:3000/order",
            dataType: "jsonp",
            data: data
        }).done(function (data) {
            console.log(data);
            orderPlaced();
        })
            .fail(function (data) {
                console.log(data);
            })

        $('#huren').slideUp();
        $('#Overzicht').slideUp();
        $('#bedankt').slideDown();
    }
});

function orderPlaced(){}