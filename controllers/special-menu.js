const menuSpecialModel = require('../models/special-menu');

const restaurantModel = require('../models/restaurant-model');

exports.add = async (req, res) => {

    try {

        let {

            galery ,
            
            titre ,
        
            complements ,
        
            dateFin ,
        
            description ,
        
            pourcentage  ,
        
            plats ,
        
            isLivraible ,
        
            isFreeLivraison ,
            

            
    
        } = req.body
    
        const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).exec();
    
        if(restaurant != undefined) {
    
            const menuspecial = menuSpecialModel();
    
            plats.galery = galery ;
            plats.titre = titre ;
            plats.dateFin = dateFin ;
            plats.complements = complements ;
            plats.description = description ;
            plats.pourcentage = pourcentage ;
            plats.isLivraible = isLivraible ;
            plats.isFreeLivraison = isFreeLivraison ;
            plats.idRestaurant = restaurant.id ;
    
            const menuSpecialSave = await menuspecial.save();
    
            res.status(201).json({
                message: 'creation plats',
                status: 'OK',
                data: menuSpecialSave,
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
        const menuSpecials = await menuSpecialModel.find().exec();

        res.status(200).json({
            message: 'menu special ',
            status: 'OK',
            data: menuSpecials,
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

