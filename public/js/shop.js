var pieper = false;
var shovel = false;
var sonde = false;
var bag = false;
var startdatum = '';
var einddatum = '';
var bedragen = {
    pieper:4,
    shovel:0.5,
    sonde:0.5,
    bag:0.5,
    send:7.5
}
var dagen = 1;
var startPicker = startDatepicker.pickadate('picker')
var endPicker = endDatePicker.pickadate('picker')

$(document).ready(function(){
    var now = new Date(Date.now);
    startPicker.set('select', now);
    endPicker.set('select', now);
    $('.gegevens').hide();
    showorhideshop();
    update_shop();

    $('.picker__holder').click(function(){
        startdatum = new Date(startPicker.get('select', 'yyyy/mm/dd'));
        einddatum = new Date(endPicker.get('select', 'yyyy/mm/dd'));
        var msToDays = (function(timeMs){return timeMs  / 1000 / 60 / 60 / 24 + 1});

        var msNegative = startdatum - einddatum; //negative value
        var ms = msNegative * -1; // positive value
        dagen = msToDays(ms);
        update_shop();
    });

    $('.no').click(function(){
        console.log($(this).attr("data-rental"));
        $("div[data-rental*="+ $(this).attr("data-rental") +"]").removeClass('selected')
        $(this).addClass('selected');

        if($(this).attr("data-rental") == 'pieper'){
            pieper = false;
        } else if( $(this).attr("data-rental") == 'shovel'){
            shovel = false;
        } else if ($(this).attr("data-rental") == 'sonde'){
            sonde = false;
        } else {
            bag = false;
        }

        update_shop();
    });

    $('.yes').click(function(){
        console.log($(this).attr("data-rental"));
        $("div[data-rental*="+ $(this).attr("data-rental") +"]").removeClass('selected')
        $(this).addClass('selected');

        if($(this).attr("data-rental") == 'pieper'){
            pieper = true;
        } else if( $(this).attr("data-rental") == 'shovel'){
            shovel = true;
        } else if ($(this).attr("data-rental") == 'sonde'){
            sonde = true;
        } else {
            bag = true;
        }
        update_shop();
    });

});

function update_shop(){
    if(pieper)
        $('.beacon .right').html('&euro;' + (dagen * bedragen.pieper).toFixed(2));
    else
        $('.beacon .right').html('&euro;0');
    if(shovel)
        $('.shovel .right').html('&euro;' + (dagen * bedragen.shovel).toFixed(2));
    else
        $('.shovel .right').html('&euro;0');
    if(sonde)
        $('.sondeerstok .right').html('&euro;' + (dagen * bedragen.sonde).toFixed(2));
    else
        $('.sondeerstok .right').html('&euro;0');
    if(bag)
        $('.backpack .right').html('&euro;' + (dagen * bedragen.bag).toFixed(2));
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
}

var subtotaal = (function(){
    var value =
        (pieper ? bedragen.pieper * dagen : 0) +
        (shovel ? bedragen.shovel * dagen : 0) +
        (sonde ? bedragen.sonde * dagen : 0) +
        (bag ? bedragen.bag * dagen : 0);

    return value;
})

var totaal = (function(){
    var value = subtotaal() +
        (pieper || shovel || sonde || bag ? bedragen.send : 0);

    return value;
})

var borg = (function(){
    var value =
        (pieper ? 150 : 0) +
        (shovel ? 25 : 0) +
        (sonde ? 25 : 0);

    return value;
})