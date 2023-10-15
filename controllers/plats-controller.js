const platsModel = require('../models/plats-model');

const restaurantModel = require('../models/restaurant-model');

const objectPopulate = [{
    path : 'galery'
}];

exports.add = async (req, res) => {

    try {

        let {

            galery ,
        
            titre ,
        
            complements ,
        
            
            description,
        
            tarif  ,
        
            isLivraible ,

            specialite,

            menu,

            isFreeLivraison
    
        } = req.body
    
        const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).exec();
    
        if(restaurant != undefined) {
    
            const plats = platsModel();
    
            plats.galery = galery ;
            plats.pays = restaurant.pays ;
            plats.specialite = specialite ;
            plats.menu = menu ;
            plats.titre = titre ;
            plats.complements = complements ;
            plats.description = description ;
            plats.tarif = parseFloat(tarif) ;
            plats.isLivraible = isLivraible ;
            plats.isFreeLivraison = isFreeLivraison ;
            plats.idRestaurant = restaurant.id ;
    
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
        const plats = await platsModel.find().populate(objectPopulate).exec();

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

exports.allByRestaurantAdmin = async (req ,res) => {
    
    try {
         const plats = await platsModel.find({
            idRestaurant : req.user.id_user
         }).populate(objectPopulate).exec();
 
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
 
