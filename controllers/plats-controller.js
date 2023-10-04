const platsModel = require('../models/plats-model');

const restaurantModel = require('../models/restaurant-model');

exports.add = async (req, res) => {

    try {

        let {

            galery ,
        
            titre ,
        
            complements ,
        
            
            description,
        
            tarif  ,
        
            isLivraible ,

            isFreeLivraison
    
        } = req.body
    
        const reservation = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).exec();
    
        if(reservation != undefined) {
    
            const plats = platsModel();
    
            plats.galery = galery ;
            plats.titre = titre ;
            plats.complements = complements ;
            plats.description = description ;
            plats.tarif = tarif ;
            plats.isLivraible = isLivraible ;
            plats.isFreeLivraison = isFreeLivraison ;
            plats.idRestaurant = reservation.id ;
    
            const platsSave = await plats.save();
    
            res.status(201).json({
                message: 'creation plats',
                status: 'OK',
                data: platsSave,
                statusCode: 201
            });
    
    
        }else {
            res.status(404).json({
                message: 'restaurant not found',
                status: 'NOT OK',
                data: 'restaurant pas trouvé',
                statusCode: 404
            });
        }
    } catch (error) {
        res.status(404).json({
            message: 'erreur server',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.all = async (req ,res) => {
    
   try {
        const plats = await platsModel.find().exec();

        res.status(200).json({
            message: 'creation plats',
            status: 'OK',
            data: plats,
            statusCode: 200
        })
   } catch (error) {
        res.status(404).json({
            message: 'erreur server',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        })
   }

}

