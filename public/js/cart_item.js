var cart_add_item = function(product){
    elements = {
        row1: '<li class="collection-item beacon">',
            row2: '<div>',
                row3: '&nbsp;',
                row4: '<i data-rental="' + product.id + '" class="left material-icons prefix shoppingcart blue-text teal-text lighten-2 no">close</i>',
                row5: '<div class="left">' + product.name + '</div>',
                    row6: '<div class="right">&euro;<div class="cost">' + product.price + '</div></div>',
                row7: '</div>',
            row8: '</div>',
        row9: '</li>'
    }
}