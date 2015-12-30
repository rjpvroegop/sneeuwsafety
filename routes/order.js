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
    var toevoeging = getURLParameter('toevoeging', req.url);
    var tas = getURLParameter('tas', req.url);
    var pieper = getURLParameter('pieper', req.url);
    var sonde = getURLParameter('sonde', req.url);
    var schep = getURLParameter('schep', req.url);
    var start = new Date(getURLParameter('start', req.url));
    var eind = new Date(getURLParameter('eind', req.url));
    var dagen = days(start, eind);

    var data = {naam:naam,email:email,telefoon:telefoon,straat:straat,postcode:postcode,huisnummer:huisnummer,toevoeging:toevoeging
        ,tas:tas,pieper:pieper,sonde:sonde,schep:schep,start:start,eind:eind
        ,dagen:dagen}

    if(naam && email && telefoon && straat && postcode && huisnummer && (schep || sonde || pieper) && start && eind && dagen)
        res.jsonp({success:true})
    else
        res.jsonp(data);

    saveOrder(data);
});

function days(start, eind){
    var msToDays = (function(timeMs){return timeMs  / 1000 / 60 / 60 / 24 + 1});
    var msNegative = start - eind; //negative value
    var ms = msNegative * -1; // positive value
    return msToDays(ms);
}

function saveOrder(data){

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'randy vroegop <info@sneeuwsafety.nl>', // sender address
        to: data.email, // list of receivers
        subject: 'ORDER GEPLAATST sneeuwsafety', // Subject line
        text: JSON.stringify(data) // plaintext body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = router;