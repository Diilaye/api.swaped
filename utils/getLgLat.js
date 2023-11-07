
const axios = require('axios');

const googleMapsClient = require('@google/maps').createClient({
    key: process.env.MAPKEY
});



require('dotenv').config({
    path:'./.env'
});


exports.getLgLat = async (input) => {

    return new Promise((resolve ,reject  ) => {
        return googleMapsClient.geocode({
            address: input
            }, (err, response) => {
            if (err) {
                console.log("err");
                reject(err);
            }
    
            if (response.json.status === 'OK') {
    
                const location = response.json.results[0].geometry.location;
                resolve(response.json.results[0].geometry.location);
            } else {
                console.error(`Impossible de géocoder l'adresse : ${response.json.status}`);
                reject(`Impossible de géocoder l'adresse : ${response.json.status}`);
            }
        });
    });

   
  
}



exports.getDistance =  (point1,point2 ) => {

    const apiUrl = ` https://maps.googleapis.com/maps/api/distancematrix/json?origins=${point1.lat},${point1.lng}&destinations=${point2.lat},${point2.lng}&key=${process.env.MAPKEY}`;

    try {
        return axios.get(apiUrl )
     .then(response => {
        console.log(response.data.rows[0].elements[0]);
        if (response.data.status === 'OK' ) {
           return response.data.rows[0].elements[0];
          } else {
            console.log("else error");
            return {
                distance: { text: '0 km', value: 100000000000 },
                duration: { text: '0 mins', value: 0 },
                status: 'NOT OK'
              };
          }
     })
     .catch(error => {
        console.log("error");
        console.log(error);
        return {
            distance: { text: '0 km', value: 100000000000 },
            duration: { text: '0 mins', value: 0 },
            status: 'NOT OK'
          };
     });
    } catch (error) {
        return {
            distance: { text: '0 km', value: 100000000000 },
            duration: { text: '0 mins', value: 0 },
            status: 'NOT OK'
          };
    }

    
   

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