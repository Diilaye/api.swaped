
const offreSpecialCommandeModel = require('../models/offre-special-comande');

const offreSpecialModel = require('../models/special-menu');

const { DateTime } = require('luxon');

const { request } = require('urllib');



exports.add = async (req,res) => {

    let {

        quantity ,
    
        offre ,
    
        prix_total ,
    
        prix_offre ,
    
        prix_livraison ,
    
        pointDepart ,
    
        pointArrive ,
          
        statusLivraison,

        contriePaiement,

        phonePaiement,
        
        means,

        otp,

        creneaux,

        addresseLivraion,
        
        addresseRestaurant

    
    } = req.body ;


    const offreFind = await offreSpecialModel.findById(offre).exec();

    if (offreFind) {

        const offreCommande = offreSpecialCommandeModel();

        offreCommande.reference = DateTime.now().ts;

        offreCommande.offre = offre;

        offreCommande.quantity = quantity;

        offreCommande.restaurant = offreFind.idRestaurant;

        offreCommande.client = req.user.id_user;

        offreCommande.prix_total = prix_total;

        offreCommande.prix_offre = prix_offre;

        offreCommande.prix_livraison = prix_livraison ;

        offreCommande.statusLivraison = statusLivraison;

        offreCommande.pointDepart = pointDepart;

        offreCommande.pointArrive = pointArrive;

        offreCommande.addresseLivraion = addresseLivraion;

        offreCommande.addresseRestaurant = addresseRestaurant;

        offreCommande.contriePaiement = contriePaiement;

        offreCommande.phonePaiement = phonePaiement;

        offreCommande.creneaux = creneaux;

        offreCommande.means = means;

        const offreCommandeSave = await offreCommande.save();

        if(contriePaiement == 'GN') {
            const url = 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceGN+'/transaction?loginAgent='+process.env.loginAgentGN+'&passwordAgent='+process.env.passwordAgentGN;
            let data = {};
            if(means == "OM") {
            
                data = JSON.stringify({
                "idFromClient": process.env.idFromClientGN,
                "amount": 1000,
                "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                "additionnalInfos": {
                    "destinataire": phonePaiement,
                    "otp": otp,
                },
                "recipientNumber": phonePaiement,
                "serviceCode": "PAIEMENTMARCHANDOMPAYGNDIRECT"
                });
            
                
            }else {
                data = JSON.stringify({
                "idFromClient": process.env.idFromClientGN,
                "additionnalInfos": {
                    "destinataire": "+224660238758",
                },
                "amount": 1000,
                "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
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

            request(url,options).then(async (value) => {
                const obj = Object.assign(JSON.parse(value.data.toString()));

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
        }else if(contriePaiement == 'SN') {

            const url = 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceSN+'/transaction?loginAgent='+process.env.loginAgentSN+'&passwordAgent='+process.env.passwordAgentSN;

            let data = {};

            if (means =="OM") {
                data = JSON.stringify({
                    "idFromClient":  DateTime.now().ts,
                        "additionnalInfos": {
                        "destinataire":phonePaiement, 
                            "otp" : otp
                        },
                        "amount": prix_total,
                        "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                        "recipientNumber": phonePaiement,
                        "serviceCode": "PAIEMENTMARCHANDOMSN2"  
                });
            }else if(means == "WAVE") {
                data = JSON.stringify({
                    "idFromClient":DateTime.now().ts,
                    "additionnalInfos": {
                        "destinataire": phonePaiement,
                        "partner_name": "SwApp",
                        "return_url":"https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                        "cancel_url": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                        "currency": "XOF"
                    },
                    "amount": 100,
                    "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                    "recipientNumber": phonePaiement,
                    "serviceCode": "SNPAIEMENTWAVE"
                });
            }else {
                data = JSON.stringify({
                    "idFromClient":  DateTime.now().ts,
                    "additionnalInfos": {
                        "destinataire":phonePaiement
                      },
                      "amount": prix_total,
                      "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                      "recipientNumber": phonePaiement,
                      "serviceCode": "PAIEMENTMARCHANDTIGO" 
                });
            }


            options = {
                method: 'PUT',
                rejectUnauthorized: false,
                digestAuth: `${process.env.UsernameDisgestSN}:${process.env.PasswordDisgestSN}`,
                data :  data
            }

            request(url,options).then(async (value) => {
                const obj = Object.assign(JSON.parse(value.data.toString()));

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
        }else {

            const url = "https://api.gutouch.com/dist/api/touchpayapi/v1/"+process.env.agenceCI+"/transaction?loginAgent="+process.env.loginAgentCI+"&passwordAgent="+process.env.passwordAgentCI;

            let data  = {};

            if (means == "OM") {
                data = JSON.stringify( {  
                    "idFromClient": process.env.idFromClientCI,   
                    "additionnalInfos": { 
                        "destinataire":phonePaiement  
                    },   
                    "amount": prix_total,   
                    "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,   
                    "recipientNumber": phonePaiement,  
                    "serviceCode": "PAIEMENTMARCHANDOM"  
                });
            } else if(means == "WAVE") {
                data = JSON.stringify({
                    "idFromClient": DateTime.now().ts ,
                    "additionnalInfos": {
                        "destinataire": phonePaiement,
                        "partner_name": "Swapp",
                        "return_url": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                        "cancel_url": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference
                    },
                    "amount": prix_total,
                    "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,
                    "recipientNumber": phonePaiement,
                    "serviceCode": "CI_PAIEMENTWAVE_TP"
                });
            }else if(means == "MOOV"){
                data = JSON.stringify( {  
                    "idFromClient": process.env.idFromClientCI,   
                    "additionnalInfos": { 
                        "destinataire":phonePaiement  
                    },   
                    "amount": prix_total,   
                    "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,   
                    "recipientNumber": phonePaiement,  
                    "serviceCode": "PAIEMENTMARCHAND_MOOV_CI"  
                });
            }else {
                data = JSON.stringify( {  
                    "idFromClient": process.env.idFromClientCI,   
                    "additionnalInfos": { 
                        "destinataire":phonePaiement  
                    },   
                    "amount": prix_total,   
                    "callback": "https://api-swaped.deally.fr/v1/api/wallet-transactions/success?reference="+offreCommandeSave.reference,   
                    "recipientNumber": phonePaiement,  
                    "serviceCode": "PAIEMENTMARCHAND_MTN_CI"  
                });
            }


            options = {
                method: 'PUT',
                rejectUnauthorized: false,
                digestAuth: `${process.env.UsernameDisgestCI}:${process.env.PasswordDisgestCI}`,
                data :  data
            }

            request(url,options).then(async (value) => {
                const obj = Object.assign(JSON.parse(value.data.toString()));

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



        
    }else {
       return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: "Offre not found",
            statusCode: 404
        });
    }

}

exports.all = async (req,res) => {

    try {

        const allOffre = await offreSpecialCommandeModel.find().exec();

        return res.status(201).json({
            message: 'liste offres special commande',
            status: 'OK',
            data: allOffre,
            statusCode: 201
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data:error,
            statusCode: 404
        });
    }

}

exports.allByClient = async (req,res) => {

    try {

        const allOffre = await offreSpecialCommandeModel.find({
            client : req.user.id_user
        }).exec();

        return res.status(201).json({
            message: 'liste offres special commande',
            status: 'OK',
            data: allOffre,
            statusCode: 201
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data:error,
            statusCode: 404
        });
    }

}

exports.allByRestaurant = async (req,res) => {

    try {

        const allOffre = await offreSpecialCommandeModel.find({
            restaurant : req.user.id_user
        }).exec();

        return res.status(201).json({
            message: 'liste offres special commande',
            status: 'OK',
            data: allOffre,
            statusCode: 201
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data:error,
            statusCode: 404
        });
    }

}


exports.success = async (req,res)=> {

    try {
        const offreCommande = await offreSpecialCommandeModel.findOne({
            reference : req.query.reference
        }).exec();
      
        if (req.body.status == "SUCCESSFUL") {
            offreCommande.status =  "SUCCESS";
        } else {
            offreCommande.status = "CANCELED";
        }
      
        offreCommande.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');
      
      
        const tf = await offreCommande.save();
      
        console.log(tf);
      
       return res.sendFile(__dirname + "/success.html");
      
    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: "Offre not found",
            statusCode: 404
        });
    }
  }