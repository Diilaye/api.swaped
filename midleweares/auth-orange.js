const axios = require('axios');
require('dotenv').config({
    path: './.env'
});
  module.exports = async (req,res,next) => {

    const response = await axios.post(
        'https://api.orange.com/oauth/v3/token',
        new URLSearchParams({
          'grant_type': 'client_credentials'
        }),
        {
          headers: {
            'Authorization': 'Basic '+process.env.BAREARTOKENOM+'==',
            'Accept': 'application/json'
          }
        }
      );

      console.log("response => OM");
      console.log(response['data']);

      next();

      
    // axios.request(config)
    // .then((responseData) => {
    //     req.tokenOM =  responseData.data['access_token'];
    //     console.log(JSON.stringify(responseData.data));
    //     // return res.json(req.tokenOM)
    //     next();
    // })
    // .catch((error) => {
    // console.log(error);
    // res.json({
    //     message: 'unauthorized authentication required',
    //     statusCode: 401,
    //     data: error,
    //     status: 'NOT OK'
    // });
    // });
  }