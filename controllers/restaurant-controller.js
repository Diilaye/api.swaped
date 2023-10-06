const restaurantModel = require('../models/restaurant-model');

const populateObject = [{
    path :'gallerie'
},{
    path :'photoCover',
}];

exports.one = async (req,res) => {

    

    try {

        const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).populate(populateObject).exec();

      


        return  res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: restaurant,
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


exports.all = async (req ,res )=> {

    try {
        
        const restaurants = await restaurantModel.find(req.query).populate(populateObject).exec();

        return  res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: restaurants,
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


exports.update = async (req,res) => {

    let {
        specialite,
    
        adresse ,
    
        heureOuverture ,
    
        heureFermeture ,
    
        jourOuvertures ,
    
        nombreTable ,
    
        nomEntreprise,
    
        descriptionEntreprise ,
    
        telephone ,
    
        telephone1 ,
    
        telephone2 ,
    
        email ,
    
        photoCover ,
    
        gallerie ,
    
        commodite  ,
    } = req.body;

    const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).populate(populateObject).exec();


    if (restaurant != undefined) {
        
        if(specialite != undefined) {
            restaurant.specialite = specialite;
        }

        if(adresse != undefined) {
            restaurant.adresse = adresse;
        }

        if(heureOuverture != undefined) {
            restaurant.heureOuverture = heureOuverture;
        }

        if(heureFermeture != undefined) {
            restaurant.heureFermeture = heureFermeture;
        }

        if(jourOuvertures != undefined) {
            restaurant.jourOuvertures = jourOuvertures;
        }
        if(nombreTable != undefined) {
            restaurant.nombreTable = nombreTable;
        }
        if(nomEntreprise != undefined) {
            restaurant.nomEntreprise = nomEntreprise;
        }

        if(descriptionEntreprise != undefined) {
            restaurant.descriptionEntreprise = descriptionEntreprise;
        }

        if(telephone != undefined) {
            restaurant.telephone = telephone;
        }

        if(telephone1 != undefined) {
            restaurant.telephone1 = telephone1;
        }

        if(telephone2 != undefined) {
            restaurant.telephone2 = telephone2;
        }

        if(email != undefined) {
            restaurant.email = email;
        }

        if(photoCover != undefined) {
            restaurant.photoCover = photoCover;
        }

        if(gallerie != undefined) {
            restaurant.gallerie = gallerie;
        }

        if(commodite != undefined) {
            restaurant.commodite = commodite;
        }

        const saveRestaurant = await restaurant.save();

        return  res.status(200).json({
            message: 'upadte réussi',
            status: 'OK',
            data: saveRestaurant,
            statusCode: 200
        });


    } else {
        return res.status(404).json({
            message: 'restaurant not found',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
        });
    }


}

