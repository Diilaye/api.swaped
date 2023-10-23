const restaurantModel = require('../models/restaurant-model');

const populateObject = [{
    path :'gallerie'
},{
    path :'photoCover',
}];

const populateObjectRestaurantsPlats = [{
    path :'gallerie'
},{
    path :'photoCover',
},{
    path :'plats',
    populate : [{
        path : 'galery'
    }]
},{
    path : 'specialMenu',
    populate :[
        {
             path :'plats',
             populate : {
                 path : 'galery'
             }
        },{
         path : 'galery'
        }
     
     ]
}
];



exports.one = async (req,res) => {

    

    try {

        const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).populate(populateObject).exec();
      
        return  res.status(200).json({
            message: 'restaurant found',
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
        
        const restaurants = await restaurantModel.find(req.query).populate(populateObjectRestaurantsPlats).exec();

        const restauranFind = [];

        for (const iterator of restaurants) {
            const object = Object.assign(iterator);
            const result = {};
            // Trouver le plus petit tarif

            let plusPetitTarif =0;
            let plusGrandTarif = 0;

            if(object.plats.length !=0) {
                plusPetitTarif = object.plats.map((plat) => plat["tarif"]).reduce((a, b) => a < b ? a : b);

                // Trouver le plus grand tarif
                plusGrandTarif = object.plats.map((plat) => plat["tarif"]).reduce((a, b) => a > b ? a : b);
            }
        
            result["restaurant"] = iterator;
            result["minTarif"] = plusPetitTarif;
            result["maxTarif"] = plusGrandTarif;

            restauranFind.push(result);

        }



        return  res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: restauranFind,
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

