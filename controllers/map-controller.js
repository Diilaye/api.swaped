const axios = require('axios');

require('dotenv').config({
    path:'./.env'
});



exports.place = async (req,res , next) =>  {
    const input = req.query.input;
  
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
        params: {
          input,
          types: 'establishment', // Vous pouvez ajuster les types de résultats que vous voulez ici
          key: process.env.MAPKEY,
          components: 'country:gn', 
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

      
  
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`;
  
      axios.get(apiUrl ,{
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
          res.json(response.data.results[0].geometry.location);
  
      })
      .catch(error => {
          console.error('Error:', error.message);
      });
    }