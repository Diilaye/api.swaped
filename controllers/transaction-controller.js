const transactionModel = require('../models/transactions');
const { DateTime } = require('luxon');
const  paypal = require('paypal-rest-sdk');
const path = require('path');
const walletModel = require('../models/wallet');

const { makeid } = require('../utils/random-by-issa');

require('dotenv').config({
  path: './.env'
});

const axios = require('axios');

const { request } = require('urllib');

exports.add = async (req ,res) => {

    try {
        
        let {

            amount ,
        
            justificatif ,
            
            service ,
            
            typeService,

            type,
    
        } = req.body ;

        
        
       if(type == 'PAYPAL'){
            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "https://api-swaped.deally.fr/v1/api/transactions/success",
                    "cancel_url": "https://api-swaped.deally.fr/v1/api/transactions/failled"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "reservation logement",
                            "sku":"paiement",
                            "price": "1",
                            "currency": "EUR",
                            "quantity": "1"
                        }]
                    },
                    "amount": {
                        "currency": "EUR",
                        "total": "1"
                    },
                    "description": "Description des avantages de cette abonnements."
                }]
            };
            paypal.payment.create(create_payment_json, async (error, payment)  => {
                if (error) {
                    throw error;
                } else {
                    const transaction = transactionModel();
                
                    transaction.amount = amount;
                
                    transaction.client = req.user.id_user;
                
                    transaction.justificatif = justificatif;
                    
                    transaction.service = service;

                    transaction.typeService = typeService;

                    transaction.token = payment['links'][1]['href'].split('token=')[1];
                
                    transaction.type = type;
                    
                    const saveTransaction = await transaction.save();
                
                    console.log("Create Payment Response");
                    console.log(payment);
                    return res.status(201).json({
                        message: 'creation supréssion ',
                        statusCode: 201,
                        url:payment['links'][1]['href'],
                        data : saveTransaction,
                        status: 'NOT OK'
                    });
                    
            
                }
            });
       }else if(type == 'OM') {
                 const transaction = transactionModel();
                
                    transaction.amount = amount;
                
                    transaction.client = req.user.id_user;
                
                    transaction.justificatif = justificatif;
                    
                    transaction.service = service;

                    transaction.typeService = typeService;

                    transaction.token = DateTime.now().ts;
                
                    transaction.type = type;
                    
                    const saveTransaction = await transaction.save();
                
                    
                    return res.status(201).json({
                        message: 'creation supréssion ',
                        statusCode: 201,
                        url:null,
                        data : saveTransaction,
                        status: 'NOT OK'
                    });
       }else if(type == 'DEALLY') {

        const wallet = await walletModel.findOne({
            userId : req.user.id_user
        }).exec();


        if(wallet !=undefined) {

            if (parseFloat(wallet.montantDEALLY) >= parseFloat(amount) ) {

                const transaction = transactionModel();
                    
                transaction.amount = amount;
            
                transaction.client = req.user.id_user;
            
                transaction.justificatif = justificatif;
                
                transaction.service = service;

                transaction.typeService = typeService;

                transaction.token = DateTime.now().ts;
            
                transaction.type = type;

                transaction.status = "SUCCESS";
    
                transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');
                
                const saveTransaction = await transaction.save();

                wallet.montantDEALLY = (parseFloat(wallet.montantDEALLY) - parseFloat(amount)).toString();

                await wallet.save();
            
                
                return res.status(201).json({
                    message: 'creation supréssion ',
                    statusCode: 201,
                    url:null,
                    data : saveTransaction,
                    status: 'NOT OK'
                });
            }else {
                return res.status(404).json({
                    message: 'erreur  server ',
                    statusCode: 404,
                    data : "solde insufisant ",
                    status: 'NOT OK'
                });
            }

        } else {
            return res.status(404).json({
                message: 'erreur  server ',
                statusCode: 404,
                data : "vous avez pas de wallet ",
                status: 'NOT OK'
            });
        }


            

       }else if(type == 'MOMO') {

            const transaction = transactionModel();
                    
            transaction.amount = amount;
        
            transaction.client = req.user.id_user;
        
            transaction.justificatif = justificatif;
            
            transaction.service = service;

            transaction.typeService = typeService;

            transaction.token = DateTime.now().ts;
        
            transaction.type = type;
            
            const saveTransaction = await transaction.save();
        
            
            return res.status(201).json({
                message: 'creation supréssion ',
                statusCode: 201,
                url:null,
                data : saveTransaction,
                status: 'NOT OK'
            });

       } 
    
       

    } catch (error) {
        return res.status(404).json({
            message: 'erreur supréssion ',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
        });
    }


}

exports.success = async (req,res) => {
    console.log("success");

    console.log(req.query);

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const transaction = await transactionModel.findOne({
        token : req.query.token
    }).exec();

    transaction.status = "SUCCESS";
    

    transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');


    const tf = await transaction.save();

    console.log(tf);

   
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
        res.redirect(__dirname + "/success.html");
      }

    });
}

exports.failed = async (req ,res ) => {
    console.log("failed");
    console.log(req.query);
    const transaction = await transactionModel.findOne({
        token : req.query.token
    }).exec();

    transaction.status = "CANCELED";
    

    transaction.dateTransactionSuccess = new Date().toISOString().split('T')[0];


   const tf = await transaction.save();

   res.sendFile(__dirname + "/failled.html");

}


exports.cashinSn = async (req,res) => {

    let {
        means
    } = req.query;

   if (means == "OM") {
        const options = {
            method: 'POST',
            url: 'https://apidist.gutouch.net/apidist/sec/DGNSN0001/cashin',
            headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic MWJiZDEyMzQzYjg0MzhmOTMyMTRkN2I2YjUwNGY2ZWUyMzczY2NmMzRlZGZmMDMxMDE0YTcwNWRmNmFkNWI5NDpiM2E1MDY1MTg5N2ZiMjc0MzdlNTA3N2JmNTVhM2NhMWUxYmRmOTZjZThiMWMwMzc1MzU0ZTE1ZDJhNWU5OTdm'
            },
            data: {
            service_id: 'CASHINOMPART',
            recipient_phone_number: '772488807',
            amount: 100,
            partner_id: 'PG05888203',
            partner_transaction_id: '1699627332889',
            login_api: '0772488807',
            password_api: 'YFnWWTg6TH',
            call_back_url: 'https://api-swaped.deally.fr/v1/api/transactions/success-intouch'
            }
        };
        
        axios.request(options).then(function (response) {
            console.log(response.data);
            res.json({
                data : response.data
            });
        }).catch(function (error) {
            console.error(error);
        });
   }else if(means == "WAVE") {
    const options = {
        method: 'POST',
        url: 'https://apidist.gutouch.net/apidist/sec/DGNSN0001/cashin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic MWJiZDEyMzQzYjg0MzhmOTMyMTRkN2I2YjUwNGY2ZWUyMzczY2NmMzRlZGZmMDMxMDE0YTcwNWRmNmFkNWI5NDpiM2E1MDY1MTg5N2ZiMjc0MzdlNTA3N2JmNTVhM2NhMWUxYmRmOTZjZThiMWMwMzc1MzU0ZTE1ZDJhNWU5OTdm'
        },
        data: {
          service_id: 'SN_CASHIN_WAVE',
          recipient_phone_number: '772488807',
          amount: 100,
          partner_id: 'PG05888203',
          partner_transaction_id: '1699633098166',
          login_api: '0772488807',
          password_api: 'YFnWWTg6TH',
          call_back_url: 'https://api-swaped.deally.fr/v1/api/transactions/success-intouch'
        }
      };
      
      axios.request(options).then(function (response) {
        
        console.log(response.data);
        res.json({
            data : response.data
        })
      }).catch(function (error) {
        console.error(error);
      });

   }else {
    const options = {
        method: 'POST',
        url: 'https://apidist.gutouch.net/apidist/sec/DGNSN0001/cashin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic MWJiZDEyMzQzYjg0MzhmOTMyMTRkN2I2YjUwNGY2ZWUyMzczY2NmMzRlZGZmMDMxMDE0YTcwNWRmNmFkNWI5NDpiM2E1MDY1MTg5N2ZiMjc0MzdlNTA3N2JmNTVhM2NhMWUxYmRmOTZjZThiMWMwMzc1MzU0ZTE1ZDJhNWU5OTdm'
        },
        data: {
          service_id: 'CASHINTIGOPART',
          recipient_phone_number: '765116859',
          amount: 200,
          partner_id: 'PG05888203',
          partner_transaction_id: 'flashTest-011111',
          login_api: '0772488807',
          password_api: 'YFnWWTg6TH',
          call_back_url: 'https://api-swaped.deally.fr/v1/api/transactions/success-intouch'
        }
      };
      
      axios.request(options).then(function (response) {
        console.log(response.data);
        res.json({
            data : response.data
        })
      }).catch(function (error) {
        console.error(error);
      });

   }

    
}


exports.cashinChauffeurGN = async (req,res) => {

    let {
        means,
        phone,
        amount
    } = req.body;

    let options = {};

    const wallet = await  walletModel.findOne({
      userId : req.user.id_user
    }).exec();


    if(wallet.balance >=parseInt(amount)) {

      if (means == "OM") {


        options = {
           method: 'POST',
           url: 'https://apidist.gutouch.net/apidist/sec/DEALL4657/cashin',
           headers: {
           'Content-Type': 'application/json',
           Authorization: 'Basic '+process.env.TokenGNMONEY
           },
           data: {
           service_id: 'GN_CASHIN_OM_PART',
           recipient_phone_number: phone,
           amount: parseInt(amount),
           partner_id: process.env.partnerIDGN,
           partner_transaction_id: makeid(5),
           login_api: process.env.loginAgentGN,
           password_api: process.env.passwordAgentGN,
           call_back_url: 'https://api-swaped.deally.fr/v1/api/transactions/success-intouch'
           }
       };
   
      }else  {
        options = {
           method: 'POST',
           url: 'https://apidist.gutouch.net/apidist/sec/DEALL4657/cashin',
           headers: {
           'Content-Type': 'application/json',
           Authorization: 'Basic '+process.env.TokenGNMONEY
           },
           data: {
             service_id: 'GN_CASHIN_MTN_PART',
             recipient_phone_number: phone,
             amount: parseInt(amount),
             partner_id: process.env.partnerIDGN,
             partner_transaction_id: makeid(5),
             login_api: process.env.loginAgentGN,
             password_api: process.env.passwordAgentGN,
             call_back_url: 'https://api-swaped.deally.fr/v1/api/transactions/success-intouch'
             }
         };
         
      }

      wallet.balance = wallet.balance - parseInt(amount);

      const waS = await wallet.save();
   
      axios.request(options).then(function (response)  {
       
       return res.status(201).json({
           message: 'retrait argent ',
           statusCode: 201,
           data : response.data,
           status: 'OK'
       });
       
     }).catch(function (error) {
       return res.status(404).json({
           message: 'erreur server ',
           statusCode: 404,
           data: error,
           status: 'NOT OK'
       });
     });
    }else {
      return res.status(404).json({
        message: 'solde insufisant  ',
        statusCode: 404,
        data: "pas de solde",
        status: 'NOT OK'
    });
    }

     
}




exports.successIntouch = async (req,res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
}

exports.getBalance = async (req,res) => {
    const options = {
        method: 'POST',
        url: 'https://apidist.gutouch.net/apidist/sec/DGNSN0001/get_balance',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic MWJiZDEyMzQzYjg0MzhmOTMyMTRkN2I2YjUwNGY2ZWUyMzczY2NmMzRlZGZmMDMxMDE0YTcwNWRmNmFkNWI5NDpiM2E1MDY1MTg5N2ZiMjc0MzdlNTA3N2JmNTVhM2NhMWUxYmRmOTZjZThiMWMwMzc1MzU0ZTE1ZDJhNWU5OTdm'
        },
        data: {partner_id: 'PG05888203', login_api: '0772488807', password_api: 'YFnWWTg6TH'}
      };
      
      axios.request(options).then(function (response) {
        console.log(response.data);
        res.json({
            data : response.data
        })
      }).catch(function (error) {
        console.error(error);
      });
}

exports.getBalanceGN = async (req,res) => {
    const options = {
        method: 'POST',
        url: 'https://apidist.gutouch.net/apidist/sec/DEALL4657/get_balance',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic OThmNDRlZTNlZTY1ZDM2YmZhODg2YTIyYzAwYjk2YjU5ZTk4MDIzM2NlNWZhZjA4ODJiZGYxMjg2Y2IzMjZlNDoxYzk5NzUwY2M2Yjg5MGE3OGE2NDcyYTA0ZTdjZmY3ZDg0MTBlNjEyZTlmMzhhMmQzYzg3Mjc5MDY2OWU4ZWNk'
        },
        data: {partner_id: 'GN9375', login_api: '772488807', password_api: 'vSmpY3EChE'}
      };
      
      axios.request(options).then(function (response) {
        console.log(response.data);
        res.json({
            data : response.data
        })
      }).catch(function (error) {
        console.error(error);
      });
}