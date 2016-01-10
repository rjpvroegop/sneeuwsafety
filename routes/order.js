var express = require('express');
var router = express.Router();

var nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://sneeuwsafety%40gmail.com:sneeuwveiligsafety@smtp.gmail.com');


function getURLParameter(name, url) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var naam = getURLParameter('naam', req.url);
    var email = getURLParameter('email', req.url);
    var telefoon = getURLParameter('telefoon', req.url);
    var straat = getURLParameter('straat', req.url);
    var postcode = getURLParameter('postcode', req.url);
    var huisnummer = getURLParameter('huisnummer', req.url);
    var plaats = getURLParameter('plaats', req.url);
    var toevoeging = getURLParameter('toevoeging', req.url);
    var tas = getURLParameter('tas', req.url);
    var pieper = getURLParameter('pieper', req.url);
    var sonde = getURLParameter('sonde', req.url);
    var schep = getURLParameter('schep', req.url);
    var start = new Date(getURLParameter('start', req.url));
    var eind = new Date(getURLParameter('eind', req.url));
    var dagen = days(start, eind);
    var tweePers = getURLParameter('tweePers', req.url);;

    var data = {naam:naam,email:email,telefoon:telefoon,straat:straat,postcode:postcode,huisnummer:huisnummer,toevoeging:toevoeging
        ,tas:tas,pieper:pieper,sonde:sonde,schep:schep,start:start,eind:eind
        ,dagen:dagen, plaats:plaats, personen:tweePers};

    if(naam && email && telefoon && straat && postcode && huisnummer && (schep || sonde || pieper) && start && eind && dagen) {
        if(saveOrder(data))
            res.jsonp({success: true})
        else
            res.jsonp({success: false})
    }else
        res.jsonp(data);
});

function days(start, eind){
    var msToDays = (function(timeMs){return timeMs  / 1000 / 60 / 60 / 24 + 1});
    var msNegative = start - eind; //negative value
    var ms = msNegative * -1; // positive value
    return msToDays(ms);
}

function saveOrder(data){

    data = mailMarkup(data);
// setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Sneeuwsafety <info@sneeuwsafety.nl>', // sender address
        to: data.email, // list of receivers
        bcc: "rjp.vroegop@gmail.com, tomdelno@gmail.com",
        subject: data.subject, // Subject line
        html: data.message // plaintext body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
            return true;
        }
    });
}

function mailMarkup(data){
    var beautified = {}

    var bedragen = {
        pieper:4,
        shovel:0.5,
        sonde:0.5,
        bag:0.5,
        send:7.5,
        korting:0.5
    };

    var kosten = {
        pieper:0,
        schep:0,
        sonde:0,
        tas:0,
        korting:0,
        borg: 0,
        send:bedragen.send
    }

    if(data.pieper == 'true'){
        kosten.pieper = bedragen.pieper * data.dagen * data.personen;
        kosten.borg += 150 * data.personen;
    }
    if(data.schep == 'true'){
        kosten.schep = bedragen.shovel * data.dagen * data.personen;
        kosten.borg += 25 * data.personen;
    }
    if(data.sonde == 'true'){
        kosten.sonde = bedragen.sonde * data.dagen * data.personen;
        kosten.borg += 25 * data.personen;
    }
    if(data.tas == 'true'){
        kosten.tas = bedragen.bag * data.dagen * data.personen;
    }
    if(data.pieper == 'true' && data.schep == 'true' && data.sonde == 'true' && data.tas == 'true'){
        kosten.korting = bedragen.korting * data.dagen * data.personen;
    }
    kosten.totaal = kosten.pieper + kosten.schep + kosten.sonde + kosten.tas + kosten.borg + kosten.send - kosten.korting;


    beautified.email = data.email;
    beautified.subject = "Sneeuwsafety -- Order Geplaatst -- " + data.email;

    beautified.message = "<body width=\"100%\"><table style=\"width:80%; margin:0 auto; max-width:650px;\"><tbody><th colspan=\"2\" style=\"background-color:#4CAF50; color:white;\"><h1>Uw bestelling bij sneeuwsafety</h1><img width=\"80%\" max-width=\"500px\" style=\"margin:0 auto;\" src=\"http://www.clipartbest.com/cliparts/jcx/o5b/jcxo5bAyi.png\" /></th></tbody></table>";

    beautified.message += "<table style=\"width:80%; margin:0 auto; max-width:650px;\"><tbody><th colspan=\"2\" style=\"background-color:#4CAF50; color:white;\"><h2>Gegevens</h2></th>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Naam: </b></td><td><br>" + data.naam + "</td></tr>";
    beautified.message += "<tr><td><b>email: </b></td><td><br>" + data.email + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>telefoon: </b></td><td><br>" + data.telefoon + "</td></tr>";
    beautified.message += "<tr><td><b>postcode: </b></td><td><br>" + data.postcode + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>plaats: </b></td><td><br>" + data.plaats + "</td></tr>";
    beautified.message += "<tr><td><b>huisnummer: </b></td><td><br>" + data.huisnummer + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>toevoeging: </b></td><td><br>" + data.toevoeging + "</td></tr></tbody></table>";

    beautified.message += "<table style=\"width:80%; margin:0 auto; max-width:650px;\"><tbody><th colspan=\"2\" style=\"background-color:#4CAF50; color:white;\"><h2>Bestelling</h2></th>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Pieper: </b></td><td><br>" + (data.pieper == 'true' ? 'ja' : 'nee') + "</td></tr>";
    beautified.message += "<tr><td><b>Schep: </b></td><td><br>" + (data.schep == 'true' ? 'ja' : 'nee') + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Sonde: </b></td><td><br>" + (data.sonde == 'true' ? 'ja' : 'nee') + "</td></tr>";
    beautified.message += "<tr><td><b>Tas: </b></td><td><br>" + (data.tas == 'true' ? 'ja' : 'nee') + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Personen: </b></td><td><br>" + data.personen + "</td></tr></tbody></table>";

    beautified.message += "<table style=\"width:80%; margin:0 auto; max-width:650px;\"><tbody><th colspan=\"2\" style=\"background-color:#4CAF50; color:white;\"><h2>Datum</h2></th>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Start: </b></td><td><br>" + new Date(data.start).toDateString() + "</td></tr>";
    beautified.message += "<tr><td><b>Einde: </b></td><td><br>" + new Date(data.eind).toDateString() + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Dagen: </b></td><td><br>" + data.dagen + "</td></tr></tbody></table>";

    beautified.message += "<table style=\"width:80%; margin:0 auto; max-width:650px;\"><tbody><th colspan=\"2\" style=\"background-color:#4CAF50; color:white;\"><h2>Overzicht</h2></th>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Pieper: </b></td><td>&euro; " + kosten.pieper.toFixed(2) + "</td></tr>";
    beautified.message += "<tr><td><b>Schep: </b></td><td>&euro; " + kosten.schep.toFixed(2) + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Sonde: </b></td><td>&euro; " + kosten.sonde.toFixed(2) + "</td></tr>";
    beautified.message += "<tr><td><b>Tas: </b></td><td>&euro; " + kosten.tas.toFixed(2) + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Korting: </b></td><td>&euro; " + kosten.korting.toFixed(2) + "</td></tr>";
    beautified.message += "<tr><td><b>Verzendkosten: </b></td><td>&euro; " + kosten.send.toFixed(2) + "</td></tr>";
    beautified.message += "<tr style=\"background-color:#f2f2f2;\"><td><b>Borg: </b></td><td>&euro; " + kosten.borg.toFixed(2) + "</td></tr>";
    beautified.message += "<tr><td colspan=\"2\"><h2>Totaal: &euro; " + kosten.totaal.toFixed(2) + "</h2></td></tr></tbody></table>";




    //{naam:naam,email:email,telefoon:telefoon,straat:straat,postcode:postcode,huisnummer:huisnummer,toevoeging:toevoeging
    //    ,tas:tas,pieper:pieper,sonde:sonde,schep:schep,start:start,eind:eind
    //    ,dagen:dagen}
    return beautified;
}

module.exports = router;