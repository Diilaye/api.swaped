exports.getPriceLivriason = price => {

    if((price / 500) < 10 ) {
        return 5000 ;
    }
    return  Math.floor(price / 500) % 2 == 0 ? (price / 500) % 1 < .5 ?  Math.floor(price / 500) * 500 : Math.ceil(price / 500) * 500   :  Math.ceil(price / 500) * 500 ;
}   