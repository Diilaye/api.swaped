const restaurantModel = require('../models/reservation');

exports.add = async (req ,res) => {

   try {

    let {

        bien ,
    
        client,
    
        dateDebut ,
    
        dateFin ,
    
    } = req.body;

    const reservation = restaurantModel();

    reservation.bien = bien ;

    reservation.client = client ;

    reservation.dateDebut = dateDebut ;

    reservation.dateFin = dateFin ;

    const reservationSave = await reservation.save();

    return  res.status(201).json({
        message: 'creation réussi',
        status: 'OK',
        data: reservationSave,
        statusCode: 201
    });

   } catch (error) {
    
    return res.status(404).json({
        message: 'erreur supréssion ',
        statusCode: 404,
        data: error,
        status: 'NOT OK'
    });

   }

}

exports.all = async (req ,res )=> {

    try {
        
        const reservations = await restaurantModel.find(req.query).exec();

        return  res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: reservations,
            statusCode: 200
        });

    } catch (error) {
        
        return res.status(404).json({
            message: 'erreur supréssion ',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
        });

    }


}

