$(document).ready(function(){
    $('.parallax').parallax();
    $('.scrollspy').scrollSpy();


    $('.logo').mouseenter(function(){
        $('.logo img').attr({src:'img/logo_light.png'});
    }).mouseleave(function(){
        $('.logo img').attr({src:'img/logo_dark.png'});
    })
});

// Initialize collapse button
$(".button-collapse").sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
$('.collapsible').collapsible();
