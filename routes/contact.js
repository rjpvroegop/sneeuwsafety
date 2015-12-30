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
    var name = getURLParameter('name', req.url);
    var tel = getURLParameter('tel', req.url);
    var mail = getURLParameter('mail', req.url);
    var mes = getURLParameter('mes', req.url);

    var data = {naam:name, telefoon:tel, email:mail, message:mes};

    if(name && mail && mes || name && tel && mes) {
        save(data);
        res.jsonp({success: true});
    }else {
        res.jsonp({name: name, tel: tel, mail: mail, mes: mes});
    }
});

function save(data){

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'randy vroegop <info@sneeuwsafety.nl>', // sender address
        to: data.email, // list of receivers
        subject: 'Contactformulier sneeuwsafety', // Subject line
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