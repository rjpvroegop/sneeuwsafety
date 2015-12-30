var sname = $('.name'),
    stel = $('.tel'),
    smail = $('.mail'),
    smes = $('.message');

var send = true;

$(document).ready(function(){
    $('.contactsend').click(function(){
        send = true;

        test(sname);
        test(stel);
        test(smail);
        test(smes);

        if(send)
            sender();
    })
});

var test = function(s){
    var border = {'background': 'pink'};
    if(!s.val()){
        send = false;
        s.css(border);
    }
}

var sender = function(){
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:3000/contact",
        dataType: "jsonp",
        data: {
            name: sname.val(),
            tel: stel.val(),
            mail: smail.val(),
            mes: smes.val()
        }
    })  .done(function(data) {
        console.log(data)
        sendSucceeded();
    })
        .fail(function(data) {
            console.log( data );
        })
}

var sendSucceeded = function(){

    var title =

    $('.card-reveal')
        .slideUp()
        .html('<h2>Bedankt voor je bericht!</h2>' +
              '<p class="flow-text">Wij nemen zo spoedig mogelijk contact met je op.</p>')
        .slideDown();
}