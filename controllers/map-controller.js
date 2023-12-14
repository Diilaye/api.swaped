const axios = require('axios');

const utiilsFnc = require('../utils/getLgLat');

require('dotenv').config({
    path:'./.env'
});

const { getPriceLivriason } =require('../utils/get-livraison-price');



exports.place = async (req,res , next) =>  {
    const input = req.query.input;

    let pays = req.query.pays;

    if (pays == undefined) {
      pays = 'gn';
    }
  
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
        params: {
          input,
          types: 'establishment', // Vous pouvez ajuster les types de résultats que vous voulez ici
          key: process.env.MAPKEY,
          components: 'country:'+pays, 
          libraries:"places"// Restreindre les résultats à la Guinée
        }
      });
      
     
      res.json({
        message: 'La Liste des places trouves avec succes',
        status: 'OK',
        data: response.data.predictions,
        statusCode: 200
      })

    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des résultats');
    }
}

exports.getLatLong = async (req,res ,next) => {

      const input = req.query.input;

      let pays = req.query.pays;

      if (pays == undefined) {
        pays = 'gn';
      }
  
     const location = await utiilsFnc.getLgLatFunc(input,pays);

     res.json(location);
    
}

exports.address = async (req,res,next) => {

  let {latitude,longitude} = req.query;
  
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.MAPKEY}`;

  axios.get(geocodingUrl).then((response) => {

    if (response.data.status === 'OK' && response.data.results.length > 0) {
          address = response.data.results[0].formatted_address;
          return res.status(200).json({
            message: 'address found',
            status: 'OK',
            data: address,
            statusCode: 200
          });
    }
    
    }).catch((error) => {
      return res.status(404).json({
        message: 'erreur supréssion ',
        statusCode: 404,
        data: error,
        status: 'NOT OK'
      });
    });
}

exports.distanceCourse = async (req,res) => {
  try {
    let {
      depart ,
      arrive
    } = req.query;

    console.log(req.query);
  
    result = await  utiilsFnc.getDistance(arrive,depart);
  
    res.status(200).json({
        message: 'distance évaluer ',
        status: 'OK',
        data: result,
        statusCode: 200
    })
  } catch (error) {
    return res.status(404).json({
      message: 'erreur serveur ',
      statusCode: 404,
      data: error,
      status: 'NOT OK'
    });
  }
}

exports.livraison = async (req,res) => {

  

  try {
    let {
      lat ,
      lng,
      arrive
    } = req.query;
  
    let pays = req.query.pays;
  
    if (pays == undefined) {
      pays = 'gn';
    }
  
  
    const point2 = await utiilsFnc.getLgLatFunc(arrive,pays);
  
    console.log(point2);
  
    result = await  utiilsFnc.getDistance({
      lat : parseFloat(lat),
      lng : parseFloat(lng)
    },point2);
  
  
    result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 2.5)));
  
    result["depart"] = {
      lat : parseFloat(lat),
      lng : parseFloat(lng)
    };
    result["arrive"] = point2;
  
    return res.status(200).json({
        message: 'distance évaluer ',
        status: 'OK',
        data: result,
        statusCode: 200
    })
  } catch (error) {
    return res.status(404).json({
      message: 'erreur serveur ',
      statusCode: 404,
      data: error,
      status: 'NOT OK'
    });
  }

}



exports.livraisonDepart = async (req,res) => {

  

  try {
    let {
      depart,
      arrive,
      pays,
      typeVehicule,
      nuit
    } = req.query;

    console.log(req.query);
  
  
  if (pays == undefined) {
    pays = 'gn';
  }

  if (typeVehicule == undefined) {
    typeVehicule = 'moto';
  }

  if (nuit == undefined) {
    nuit = '0';
  }
  
    const point1 = await utiilsFnc.getLgLatFunc(depart,pays);
    const point2 = await utiilsFnc.getLgLatFunc(arrive,pays);
  
    result = await  utiilsFnc.getDistance(point1,point2);

    
    if (typeVehicule == "moto") {
      if (nuit =="1") {
        result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 3.5)));
      }else {
        result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 2.5)));
      }
    } else if(typeVehicule =="standard") {
      if (nuit =="1") {
        result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 7.5)));
      }else {
        result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 5.5)));
      }
    }else {
      if (nuit =="1") {
        result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 10)));
      }else {
        result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 7.5)));
      }
    }
  
  
    result["depart"] = point1;
    result["arrive"] = point2;
  
  
   return res.status(200).json({
        message: 'distance évaluer ',
        status: 'OK',
        data: result,
        statusCode: 200
    })
  } catch (error) {
    return res.status(404).json({
      message: 'erreur serveur ',
      statusCode: 404,
      data: error,
      status: 'NOT OK'
    });
  }

}