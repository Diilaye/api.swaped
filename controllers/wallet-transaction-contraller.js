const walletModel = require('../models/wallet');
const walletTransactionModel = require('../models/wallet-transactions');
const { DateTime } = require('luxon');
const  paypal = require('paypal-rest-sdk');
const axios = require('axios');
const cryto = require('crypto');
const  createDigestHeader  = require('digest-header');
const { request } = require('urllib');
var digest = require('http-digest-client')('98f44ee3ee65d36bfa886a22c00b96b59e980233ce5faf0882bdf1286cb326e4', '1c99750cc6b890a78a6472a04e7cff7d8410e612e9f38a2d3c872790669e8ecd','https');
require('dotenv').config({
    path: './.env'
});


const callAPI = async (method, url, data) => {
    const login = '98f44ee3ee65d36bfa886a22c00b96b59e980233ce5faf0882bdf1286cb326e4:1c99750cc6b890a78a6472a04e7cff7d8410e612e9f38a2d3c872790669e8ecd';
    
    try {
      let config = {
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        auth: {
          username: login.split(':')[0],
          password: login.split(':')[1],
        
        }
      };
  
      if (method === 'POST' || method === 'PUT') {
        config.data = data;
      }
  
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`Connection Failure: ${error.message}`);
    }
  };


exports.add = async (req,res) => {

    let  {
       
        amount,

        
        typeService,
    
        means,

        pays,

        phone,

        otp


    } =req.body;

   
    const url = 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceGN+'/transaction?loginAgent='+process.env.loginAgentGN+'&passwordAgent='+process.env.passwordAgentGN;
    
    const data = JSON.stringify({
      "idFromClient": process.env.idFromClientGN,
      "amount": amount,
      "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference=1234543",
      "recipientNumber": phone,
      "serviceCode": "PAIEMENTMARCHAND_MTN_GN"
    });

    options = {
        method: 'PUT',
        rejectUnauthorized: false,
        digestAuth: `${process.env.UsernameDisgestGN}:${process.env.PasswordDisgestGN}`,
        data :  data
    }
    
    request(url, options).then((value) => {
        console.log(JSON.stringify(response.data));
        console.log(value.status);
    });



    

    

   
}

exports.all = async (req,res) => {
    
    try {
        const find = await  walletTransactionModel.find(req.query).exec();

        return res.status(200).json({
            message: 'Creation reussi',
            status: 'OK',
            data: find,
            statusCode: 200
        });

    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.allByUser = async (req,res) => {
    try {

        const find = await  walletTransactionModel.find({
            userWallet : req.user.id_user
        }).exec();

        return res.status(200).json({
            message: 'Creation reussi',
            status: 'OK',
            data: find,
            statusCode: 200
        });

    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}



exports.failed = async (req ,res ) => {
    console.log("failed");
    console.log(req.query);
    const transaction = await walletTransactionModel.findOne({
        reference : req.query.reference
    }).exec();

    transaction.status = "CANCELED";
    

    transaction.dateTransactionSuccess = new Date().toISOString().split('T')[0];


   const tf = await transaction.save();

   res.sendFile(__dirname + "/failled.html");

}


exports.success = async (req,res)=> {
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);

}


exports.successONR = async (req,res) => {

    const transaction = await walletTransactionModel.findOne({
        reference : req.query.reference
    }).exec();



    transaction.status = "SUCCESS";
    

    transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');


    const tf = await transaction.save();



    
    
}

successFun =  async (req,res, means , reference) =>  {
    const transaction = await walletTransactionModel.findOne({
        reference : reference
    }).exec();



    transaction.status = "SUCCESS";
    

    transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');


    const tf = await transaction.save();

    console.log(tf);

    if(means == "PAYPAL") {
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
              {
                amount: {
                  "currency": "EUR",
                  "total": "1"
                }
              }
            ]
          };
        
          paypal.payment.execute(paymentId, execute_payment_json, async  (error, payment) => {
            if (error) {
              console.log(error);
              
              return res.status(404).json({
                  message: 'erreur serveur ',
                  statusCode: 404,
                  data: error,
                  status: 'NOT OK'
              });
      
            } else {
      
                const wallet = await walletModel.findById(tf.userWallet);
      
              wallet.montantDEALLY = parseFloat(wallet.montantDEALLY) + parseFloat(transaction.amount);
      
              const saveWallet = await wallet.save();
      
             return res.redirect(__dirname + "/success.html");
            }
      
          });
    }else {
        const wallet = await walletModel.findById(tf.userWallet);


        wallet.montantDEALLY = parseFloat(wallet.montantDEALLY) + parseFloat(transaction.amount);
    
        const saveWallet = await wallet.save();
    
       return res.status(201).json({
            message: 'recharge wallet',
            statusCode: 201,
            data: saveWallet,
            status: 'OK'
        });
    }
}