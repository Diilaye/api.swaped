
const axios = require('axios');

var distance = require('google-distance-matrix');
const { address } = require('../controllers/map-controller');

require('dotenv').config({
    path:'./.env'
});


distance.key(process.env.MAPKEY);

exports.getLgLat = async (input) => {
  
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`;

   return axios.get(apiUrl ,{
        params: {
            input,
            types: 'establishment', // Vous pouvez ajuster les types de résultats que vous voulez ici
            key: process.env.MAPKEY,// Restreindre les résultats à la Guinée
          }
    })
    .then(response => {
        console.log(response.data.results[0].geometry);

        const location = response.data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        return response.data.results[0].geometry.location;

    })
    .catch(error => {
        return {};
    });
}



exports.getDistance =  (addressCible , addressPoint ) => {

    const apiUrl = ` https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${addressCible}&origins=${addressPoint}&units=metric&key=${process.env.MAPKEY}`;

    return axios.get(apiUrl )
     .then(response => {
        if (response.data.status === 'OK' ) {
           return response.data.rows[0].elements[0];
          } else {
            return {
                distance: { text: '0 km', value: 100000000000 },
                duration: { text: '0 mins', value: 0 },
                status: 'NOT OK'
              };
          }
     })
     .catch(error => {
         return {};
     });

    
   

}

exports.getName = async (latitude,longitude)=> {
  
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.MAPKEY}`;

  return axios.get(geocodingUrl).then((response) => {

    if (response.data.status === 'OK' && response.data.results.length > 0) {
          return response.data.results[0].formatted_address;
    }
    
    }).catch((error) => {
      return error;
    });
}