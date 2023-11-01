const walletModel = require('../models/wallet');
const walletTransactionModel = require('../models/wallet-transactions');
const { DateTime } = require('luxon');
const  paypal = require('paypal-rest-sdk');
const axios = require('axios');

require('dotenv').config({
    path: './.env'
});

exports.add = async (req,res) => {

    
    

    try {
        let  {
       
            amount,
    
            
            typeService,
        
            means,

            pays,

            phone,

            otp

    
        } =req.body;
    
        const walletTransaction = walletTransactionModel();
    
        const find = await walletModel.findOne({
            userId : req.user.id_user
        });
    
        walletTransaction.amount = amount ;
    
        walletTransaction.userWallet = find.id ;
    
        walletTransaction.reference = DateTime.now().ts ;
    
        walletTransaction.typeService = typeService ;
    
        walletTransaction.means = means ;
    
        const saveWalletTransaction = await  walletTransaction.save();

        if(pays=='GN') {

            if (means == "MOMO") {
                
                let data = JSON.stringify({
                    "idFromClient": process.env.idFromClientGN,
                    "additionnalInfos": {
                      "destinataire": phone
                    },
                    "amount": amount,
                    "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+saveWalletTransaction.reference,
                    "recipientNumber": process.env.numberGN,
                    "serviceCode": "PAIEMENTMARCHAND_MTN_GN"
                  });
                  
                  
                 
               }else {
                
                let data = JSON.stringify({
                    "idFromClient": process.env.idFromClientGN,
                    "additionnalInfos": {
                      "destinataire": phone,
                      "otp": otp
                    },
                    "amount": amount,
                    "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+saveWalletTransaction.reference,
                    "recipientNumber": process.env.numberGN,
                    "serviceCode": "PAIEMENTMARCHAND_MTN_GN"
                  });
               }

               let config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceGN+'/transaction?loginAgent='+process.env.loginAgentGN+'&passwordAgent='+process.env.passwordAgentGN,
                headers: { 
                  'Content-Type': 'application/json'
                },
                data : data
              };

              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));

                res.status(200).json({
                    message : '',
                    status: 'OK',
                    data : JSON.stringify(response.data),
                    statusCode: 200
                })
              })
              .catch((error) => {
                console.log(error);
              });


        }else if(pays == 'SN') {
            return res.json('sn')
        }else {
            return res.json('ci')
        }


    
      
          
    

    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
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

exports.successONR = async (req,res) => {

    const transaction = await walletTransactionModel.findOne({
        reference : req.query.reference
    }).exec();



    transaction.status = "SUCCESS";
    

    transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');


    const tf = await transaction.save();



    
    
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