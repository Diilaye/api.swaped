const reservationRestaurant = require('../models/reservation-table-restaurant');

const populateObject = [{
    path :'restaurants',
    populate : [{
        path :'gallerie'
    },{
        path :'photoCover',
    }]
},{
    path :'client'
}];


exports.add = async (req,res) => {
    try {
        let {
            date ,
    
            nombrePersonne ,    
        
            restaurants,
        
            client ,
        
           creneaux ,  
        } = req.body ;
    
    
        const reservation = reservationRestaurant();
    
        reservation.date = new Date(date);
        reservation.nombrePersonne = nombrePersonne;
        reservation.restaurants = restaurants;
        reservation.client = client;
        reservation.creneaux = creneaux;
    
        const saveReservation = await reservation.save();
    
        return  res.status(200).json({
            message: 'reservation creation ',
            status: 'OK',
            data: saveReservation,
            statusCode: 200
        });
    } catch (error) {
        return  res.status(404).json({
            message: 'erreur serveur  ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}


exports.byClient =async (req,res) => {
   try {
        const reservations = await reservationRestaurant.find({
            client : req.user.id_user
        }).populate(populateObject).exec();

        
        return  res.status(200).json({
            message: 'Liste des reservations  ',
            status: 'OK',
            data: reservations,
            statusCode: 200
        });
   } catch (error) {
    return  res.status(404).json({
        message: 'erreur serveur  ',
        status: 'NOT OK',
        data: error,
        statusCode: 404
    });
   }

}

exports.byRestaurant =async (req,res) => {

    try {
        const reservations = await reservationRestaurant.find({
            restaurants : req.user.id_user
        }).populate(populateObject).exec();
    
         
        return  res.status(201).json({
            message: 'Liste des reservations  ',
            status: 'OK',
            data: reservations,
            statusCode: 201
        });
    } catch (error) {
        return  res.status(404).json({
            message: 'erreur serveur  ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}