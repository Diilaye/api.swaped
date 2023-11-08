const walletModel = require('../models/wallet');
const walletTransactionModel = require('../models/wallet-transactions');
const { DateTime } = require('luxon');
const  paypal = require('paypal-rest-sdk');
const { request } = require('urllib');



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
   
    if(pays == 'GN') {
      const url = 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceGN+'/transaction?loginAgent='+process.env.loginAgentGN+'&passwordAgent='+process.env.passwordAgentGN;
      let data = {};
      if(means == "OM") {
    
         data = JSON.stringify({
          "idFromClient": process.env.idFromClientGN,
          "amount": amount,
          "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+saveWalletTransaction.reference,
          "additionnalInfos": {
            "destinataire": phone,
            "otp": otp,
          },
          "recipientNumber": phone,
          "serviceCode": "PAIEMENTMARCHANDOMPAYGNDIRECT"
        });
    
        
      }else {
         data = JSON.stringify({
          "idFromClient": process.env.idFromClientGN,
          "additionnalInfos": {
            "destinataire": "+224660238758",
          },
          "amount": amount,
          "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+saveWalletTransaction.reference,
          "recipientNumber": phone,
          "serviceCode": "PAIEMENTMARCHAND_MTN_GN"
        });
      }

      options = {
        method: 'PUT',
        rejectUnauthorized: false,
        digestAuth: `${process.env.UsernameDisgestGN}:${process.env.PasswordDisgestGN}`,
        data :  data
    }
    
      request(url, options).then(async (value) => {
        console.log(value.data.toString());
       const obj = Object.assign(JSON.parse(value.data.toString()));
       
       if(obj.status === "SUCCESSFUL") {

          if(typeService == "recharge") {

            const transactionFind = await walletTransactionModel.findOne({
              reference : saveWalletTransaction.reference
            }).exec();

            transactionFind.status = "SUCCESS";
            transactionFind.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');

             const tf = await transactionFind.save();

             find.balance = find.balance + amount ;

             const tfW= await find.save();
          }else {
          }

       }
        return res.status(201).json({
          message: 'paiement initie',
          status: 'OK',
          data: JSON.parse(value.data.toString()),
          statusCode: 201
      });
    }).catch((error) => {
      return res.status(404).json({
        message: 'erreur serveur',
        status: 'NOT OK',
        data: error,
        statusCode: 404
    });
    });
     
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

  const transaction = await walletTransactionModel.findOne({
      reference : req.query.reference
  }).exec();

  if (req.body.status == "SUCCESSFUL") {
    if(transaction.typeService == "recharge") {

      if (transaction.means != "OM") {
        const wallet = await walletModel.findById(transaction.userWallet).exec();
        wallet.balance = wallet.balance + parseInt(transaction.amount);
        await wallet.save();
      }

      
    }
    transaction.status = "SUCCESS";
  } else {
    transaction.status = "CANCELED";
    console.log(transaction);
  }

  transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');


  const tf = await transaction.save();

  console.log(tf);

  res.sendFile(__dirname + "/success.html");


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