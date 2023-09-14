const transactionModel = require('../models/transactions');
const { DateTime } = require('luxon');
const  paypal = require('paypal-rest-sdk');

exports.add = async (req ,res) => {

    try {
        
        let {

            amount ,
        
            justificatif ,
            
            service ,
            
            typeService,

            type,
    
        } = req.body ;

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
        res.sendFile(__dirname + "/success.html");
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