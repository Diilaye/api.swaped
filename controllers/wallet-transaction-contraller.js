const walletModel = require('../models/wallet');
const walletTransactionModel = require('../models/wallet-transactions');
const { DateTime } = require('luxon');

exports.add = async (req,res) => {

    try {
        let  {
       
        amount,

        
        typeService,
    
        means,

    } =req.body;

    const walletTransaction = walletTransactionModel();

    const find = await walletModel.findOne({
        userId : req.user.id_user
    });

    walletTransaction.amount = amount ;

    walletTransaction.userWallet = find.id ;

    walletTransaction.typeService = typeService ;

    walletTransaction.means = means ;

    const saveWalletTransaction = await  walletTransaction.save();

    if (means == "PAYPAL") {
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+saveWalletTransaction.reference,
                "cancel_url": "https://api-swaped.deally.fr/v1/api/wallet-transactions/failled?reference="+saveWalletTransaction.reference
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "reservation logement",
                        "sku":"paiement",
                        "price": (parseFloat(amount) / 9000).toString(),
                        "currency": "EUR",
                        "quantity": "1"
                    }]
                },
                "amount": {
                    "currency": "EUR",
                    "total": (parseFloat(amount) / 9000).toString()
                },
                "description": "Description des avantages de cette abonnements."
            }]
        };
        
        paypal.payment.create(create_payment_json, async (error, payment)  => {
            if (error) {
                throw error;
            } else {
            
            
                console.log("Create Payment Response");
                console.log(payment);

                return res.status(201).json({
                    message: 'creation supréssion ',
                    statusCode: 201,
                    url:payment['links'][1]['href'],
                    data : saveWalletTransaction,
                    status: 'NOT OK'
                });
                
         
            }
        });
    } else  {
        successFun(means , reference);
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


successFun =  async (means , reference) =>  {
    const transaction = await walletTransactionModel.findOne({
        reference : req.query.reference
    }).exec();



    transaction.status = "SUCCESS";
    

    transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');


    const tf = await transaction.save();

    console.log(tf);

    if(req.query.means == "PAYPAL") {
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
              {
                amount: {
                  "currency": "EUR",
                  "total": (parseFloat(transaction.amount) / 9000).toString()
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
      
              res.redirect(__dirname + "/success.html");
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

exports.success = async (req,res) => {

    console.log("success");

    console.log(req.query);

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const transaction = await walletTransactionModel.findOne({
        reference : req.query.reference
    }).exec();



    transaction.status = "SUCCESS";
    

    transaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');


    const tf = await transaction.save();

    console.log(tf);

    if(req.query.means == "PAYPAL") {
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
              {
                amount: {
                  "currency": "EUR",
                  "total": (parseFloat(transaction.amount) / 9000).toString()
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
      
              res.redirect(__dirname + "/success.html");
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