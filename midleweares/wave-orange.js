const axios = require('axios');




module.exports = async (req,res,next) =>  {

  let configOrangoMoney = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.sandbox.orange-sonatel.com/api/eWallet/v4/qrcode',
    headers: { 
      'Authorization': 'Bearer '+req.tokenOM, 
      'Content-Type': 'application/json'
    },
    data :JSON.stringify({
      "amount": {
        "unit": "XOF",
        "value": req.body.amount
      },
      "callbackCancelUrl": "https://api.verumed.sn/api/v1/transactions/errorOrange?rv="+req.body.rv,
      "callbackSuccessUrl": "https://api.verumed.sn/api/v1/transactions/successOrange?rv="+req.body.rv,
      "code": 102860,
      "metadata": {},
      "name": "Verumed",
      "validity": 15
    })
  };
  
  
    if(req.body.type =="OM")  {
      axios.request(configOrangoMoney)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        req.url =  response.data['deepLink'];
        next();
      })
      .catch((error) => {
        console.log(error);
      });
    }else  {

      let WaveConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.wave.com/v1/checkout/sessions',
        headers: { 
          'Authorization': 'Bearer wave_sn_prod_t0CQb9rv21w50ooAfq8B8BjyyY9Ldx-g-eU6VS8zxYKqlHctymZX_ayTuPYPWnp8CJ4fBxpayxyXo7aa84d9zf7sl3XOBjwDKw', 
          'Content-Type': 'application/json'
        },
        data : JSON.stringify({
          "amount": req.body.amount,
          "currency": "XOF",
          "error_url": "https://api.verumed.sn/api/v1/transactions/errorWave?rv="+req.body.rv,
          "success_url": "https://api.verumed.sn/api/v1/transactions/success-wave?rv="+req.body.rv
        })
      };
      

      axios.request(WaveConfig)
      .then((response) => {
            req.url =  response.data['wave_launch_url'];
            console.log(JSON.stringify(response.data));
            next();
      })
      .catch((error) => {
        res.json({
          message: 'unauthorized authentication required',
          statusCode: 401,
          data: error,
          status: 'NOT OK'
      });
      });
    }
    
}