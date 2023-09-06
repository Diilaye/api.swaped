
const axios = require('axios');

require('dotenv').config({
    path:'./.env'
});


exports.getLgLat = async (input) => {
  
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`;

   return axios.get(apiUrl ,{
        params: {
            input,
            types: 'establishment', // Vous pouvez ajuster les types de résultats que vous voulez ici
            key: process.env.MAPKEY,
            components: 'country:gn', // Restreindre les résultats à la Guinée
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