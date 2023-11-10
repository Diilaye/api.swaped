const axios = require('axios');

const utiilsFnc = require('../utils/getLgLat');

require('dotenv').config({
    path:'./.env'
});



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
  
      axios.get(apiUrl ,{
          params: {
              input,
              types: 'establishment', // Vous pouvez ajuster les types de résultats que vous voulez ici
              key: process.env.MAPKEY,
              components: 'country:'+pays, // Restreindre les résultats à la Guinée
            }
      })
      .then(response => {
          console.log(response.data.results[0].geometry);
  
          const location = response.data.results[0].geometry.location;
          const latitude = location.lat;
          const longitude = location.lng;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          res.json(response.data.results[0].geometry.location);
  
      })
      .catch(error => {
          console.error('Error:', error.message);
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
      depart ,
      arrive
    } = req.query;

    console.log(req.query);

    const point1 = await utiilsFnc.getLgLat(depart);

    console.log(point1);

    const point2 = await utiilsFnc.getLgLat(arrive);

    console.log(point2);

    
  
    result = await  utiilsFnc.getDistance(point1,point2);

    console.log(result['distance']);


  
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