
const axios = require('axios');

const googleMapsClient = require('@google/maps').createClient({
    key: process.env.MAPKEY
});


require('dotenv').config({
    path:'./.env'
});


exports.getLgLatFunc = async (input , pays) => {

    
   

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`;

    return  axios.get(apiUrl, {
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
                return location;
            } else {
                console.error('No results found for the given address.');
                return 'No results found for the given address.';
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            // res.status(500).json({ error: 'An error occurred while fetching the location.' });
            return  error.message;
        });

   
  
}



exports.getDistance =  (point1,point2,vehicule) => {

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