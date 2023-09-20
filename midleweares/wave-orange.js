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
    }
    
}