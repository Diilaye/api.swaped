const axios = require('axios');

exports.place = async (req,res , next) =>  {
    const input = req.query.input;
  
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
        params: {
          input,
          types: 'geocode', // Vous pouvez ajuster les types de résultats que vous voulez ici
          key: apiKey,
          components: 'country:gn', // Restreindre les résultats à la Guinée
        }
      });
  
      res.json(response.data.predictions);
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
              // types: 'geocode', // Vous pouvez ajuster les types de résultats que vous voulez ici
              key: apiKey,
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