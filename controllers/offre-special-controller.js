const offreModel = require('../models/special-menu');

const restaurantModel = require('../models/restaurant-model');

const objectPopulate = [
   {
        path :'plats',
        populate : {
            path : 'galery'
        }
   },{
    path : 'galery'
   }

];

exports.add = async (req,res) => {

    try {
        let {
            galery ,
            
            titre ,
        
            complements ,
        
            dateDebut ,
        
            dateFin ,
        
            pourcentage  ,
        
            plats ,
        
            isDisponible ,
        
            isLivraible,
            
        } = req.body;
    
        const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).exec();
    
        if(restaurant != undefined) {
    
            const offre = offreModel();
    
            offre.pays = restaurant.pays;
    
            offre.idRestaurant = restaurant.id;
            offre.galery = galery;
            offre.titre = titre;
            offre.complements = complements;
            offre.dateDebut = new Date(dateDebut);
            offre.dateFin = new Date(dateFin);
            offre.pourcentage = pourcentage;
            offre.plats = plats;
            offre.isDisponible = isDisponible;
            offre.isLivraible = isLivraible;
    
            const offreSave = await offre.save();

            restaurant.specialMenu.push(offreSave);

            await restaurant.save();
    
            res.status(201).json({
                message: 'creation réussi',
                status: 'OK',
                data: offreSave,
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
            message: 'error serveur',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

function isWithinUpcomingWeek(date) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Start of the week (Sunday as the first day)

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // End of the week (next Sunday)

    return date >= startOfWeek && date <= endOfWeek;
}


exports.all = async (req,res) => {

    const offres = await offreModel.find(req.query).populate(objectPopulate).exec();

    // Filter special offers for the upcoming week
    const offreFind = offres.filter((offer) => {
        const startDate = new Date(offer.dateDebut);
        const endDate = new Date(offer.dateFin);
        return isWithinUpcomingWeek(startDate) || isWithinUpcomingWeek(endDate);
    });

    res.status(200).json({
        message: 'listes des offres',
        status: 'OK',
        data: offreFind,
        statusCode: 200
    });

}

exports.allByRestaurant = async (req,res) => {

    const restaurant = await restaurantModel.findOne({
        idParent : req.user.id_user
    }).exec();

    const offres = await offreModel.find({
        idRestaurant : restaurant.id
    }).populate(objectPopulate).exec();

    res.status(200).json({
        message: 'listes des offres',
        status: 'OK',
        data: offres,
        statusCode: 200
    });

}