const restaurantModel = require('../models/restaurant-model');

const utiilsFnc = require('../utils/getLgLat');

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

        
        let {
            pays,
            lng,
            lat
        } = req.query;
    
        if (pays == undefined) {
            pays = 'gn';
          }
        
        const restaurants = await restaurantModel.find({
            pays : pays,
            adresse : {
                $ne:""
            }
        }).populate(populateObjectRestaurantsPlats).exec();
        
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
            if (lat != undefined && lng != undefined) {
        
                const point1 = await utiilsFnc.getLgLatFunc(iterator.adresse , pays);
        
                const point2 = {lat : parseFloat(lat) , lng : parseFloat(lng) }
                
               
                result["info"] = await  utiilsFnc.getDistance(point2, point1 );
        
            }else {
                result["info"] = {
                    distance: { text: '0 km', value: 100000000000 },
                    duration: { text: '0 mins', value: 0 },
                    status: 'NOT OK'
                };    
            }
            restauranFind.push(result);
        }
        
        // Sort the restaurants by distance (ascending order)
        restauranFind.sort((a, b) => a.info['distance']['value'] - b.info['distance']['value']);
        
        return  res.status(200).json({
            message: 'listage réussi',
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


exports.allByMotard = async (req ,res )=> {

  
   

    try {

        
        let {
            pays,
            lng,
            lat
        } = req.query;
    
        if (pays == undefined) {
            pays = 'gn';
          }
        
        const restaurants = await restaurantModel.find({
            pays : "gn",
           
        }).populate(populateObject).exec();
        
        // const restauranFind = [];
        
        
        // for (const iterator of restaurants) {
        //     const object = Object.assign(iterator);
        //     const result = {};
        //     // Trouver le plus petit tarif
        
        //     let plusPetitTarif =0;
        //     let plusGrandTarif = 0;
        
        //     if(object.plats.length !=0) {
        //         plusPetitTarif = object.plats.map((plat) => plat["tarif"]).reduce((a, b) => a < b ? a : b);
        
        //         // Trouver le plus grand tarif
        //         plusGrandTarif = object.plats.map((plat) => plat["tarif"]).reduce((a, b) => a > b ? a : b);
        //     }
        
        //     result["restaurant"] = iterator;
        //     result["minTarif"] = plusPetitTarif;
        //     result["maxTarif"] = plusGrandTarif;
        //     if (lat != undefined && lng != undefined) {
        
        //         const point1 = await utiilsFnc.getLgLatFunc(iterator.adresse , pays);
        
        //         const point2 = {lat : parseFloat(lat) , lng : parseFloat(lng) }
                
               
        //         result["info"] = await  utiilsFnc.getDistance(point2, point1 );
        
        //     }else {
        //         result["info"] = {
        //             distance: { text: '0 km', value: 100000000000 },
        //             duration: { text: '0 mins', value: 0 },
        //             status: 'NOT OK'
        //         };    
        //     }
        //     restauranFind.push(result);
        // }
        
        // // Sort the restaurants by distance (ascending order)
        // restauranFind.sort((a, b) => a.info['distance']['value'] - b.info['distance']['value']);
        
        return  res.status(200).json({
            message: 'listage réussi',
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


async function getNearestRestaurants(pays, addressCible) {
    try {
      const restaurants = await restaurantModel.find({ pays: pays }).populate(populateObjectRestaurantsPlats).exec();
  
      // Calculate distances for each restaurant and sort by distance
      restaurants.forEach((restaurant) => {
        restaurant.distance = utiilsFnc.getDistance(addressCible, restaurant.adresse);
      });
  
      // Sort the restaurants by distance (ascending order)
      restaurants.sort((a, b) => a.distance - b.distance);
  
      // Select the first n (e.g., 10) restaurants as the nearest ones
      const nearestRestaurants = restaurants.slice(0, 10); // You can adjust the number as needed
  
      return nearestRestaurants;
    } catch (error) {
      throw new Error("An error occurred while getting the nearest restaurants: " + error.message);
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

        zone
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

            restaurant.localisation = await utiilsFnc.getLgLatFunc(adresse,restaurant.pays);
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
            restaurant.zone = zone;
        }

        if(zone != undefined) {
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

