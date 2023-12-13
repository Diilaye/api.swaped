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
  
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`;

      axios.get(apiUrl, {
        params: {
            address: input,
            key: process.env.MAPKEY,
            components: 'country:' + pays,
        }
    })
        .then(response => {
            console.log('Geocoding API Response:', response.data);
    
            const results = response.data.results;
    
            if (results.length > 0) {
                const location = results[0].geometry.location;
                const latitude = location.lat;
                const longitude = location.lng;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                res.json(location);
            } else {
                console.error('No results found for the given address.');
                res.status(404).json({ error: 'No results found for the given address.' });
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'An error occurred while fetching the location.' });
        });
    
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

    const point2 = await utiilsFnc.getLgLat(arrive);

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

exports.livraisonDepart = async (req,res) => {

  try {
    let {
      depart,
      arrive
    } = req.query;

    const point1 = await utiilsFnc.getLgLat(depart);
    const point2 = await utiilsFnc.getLgLat(arrive);

    result = await  utiilsFnc.getDistance(point1,point2);


    result["livraison"] = getPriceLivriason(Math.floor((result['distance']['value'] * 2.5)));

    result["depart"] = point1;
    result["arrive"] = point2;

  
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