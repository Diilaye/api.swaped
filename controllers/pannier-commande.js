
const pannierCommandeModel = require('../models/pannier-commande');

const pannierModel = require('../models/pannier');

const restaurantModel = require('../models/restaurant-model');

const walletModel = require('../models/wallet');


const { DateTime } = require('luxon');

const { request } = require('urllib');

const populateObject = [{
    path : 'panniers',
    populate : [{
        path : 'plat',
        populate : [{
            path : 'galery'
        }]
    }]
},{
    path :'client'
},{
    path : 'restaurant',
    populate  : [{
        path :'gallerie'
    },{
        path :'photoCover',
    }]
}];


exports.add = async (req,res) => {

    

    try {

        let {
        
            panniers ,
        
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
    
            restaurant,
            
            addresseLivraion,

            addresseRestaurant
        
        } = req.body ;

    
        const pannierCommande = pannierCommandeModel();
    
        pannierCommande.reference = DateTime.now().ts;
    
        pannierCommande.panniers = panniers;
    
        pannierCommande.restaurant = restaurant;
    
        pannierCommande.client = req.user.id_user;
    
        pannierCommande.prix_total = prix_total;
    
        pannierCommande.prix_offre = prix_offre;
    
        pannierCommande.prix_livraison = prix_livraison ;
    
        pannierCommande.statusLivraison = statusLivraison;
    
        pannierCommande.pointDepart = pointDepart;
    
        pannierCommande.pointArrive = pointArrive;
    
        pannierCommande.contriePaiement = contriePaiement;
    
        pannierCommande.phonePaiement = phonePaiement;
    
        pannierCommande.means = means;
    
        pannierCommande.creneaux = creneaux;

        pannierCommande.addresseLivraion = addresseLivraion;

        pannierCommande.addresseRestaurant = addresseRestaurant;
    
        const pannierCommandeSave = await pannierCommande.save();
    
        if(contriePaiement == 'GN') {
            const url = 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceGN+'/transaction?loginAgent='+process.env.loginAgentGN+'&passwordAgent='+process.env.passwordAgentGN;
            let data = {};
            if(means == "OM") { 
            
                data = JSON.stringify({
                "idFromClient": process.env.idFromClientGN,
                "amount": 1000,
                "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
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
                "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
                "recipientNumber": phonePaiement,
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
                        "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
                        "recipientNumber": phonePaiement,
                        "serviceCode": "PAIEMENTMARCHANDOMSN2"  
                });
            }else if(means == "WAVE") {
                data = JSON.stringify({
                    "idFromClient":DateTime.now().ts,
                    "additionnalInfos": {
                        "destinataire": phonePaiement,
                        "partner_name": "SwApp",
                        "return_url":"https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
                        "cancel_url": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
                        "currency": "XOF"
                    },
                    "amount": 100,
                    "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
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
                      "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
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
                    "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,   
                    "recipientNumber": phonePaiement,  
                    "serviceCode": "PAIEMENTMARCHANDOM"  
                });
                console.log("OM GUINNES");
                console.log(data);

            } else if(means == "WAVE") {
                data = JSON.stringify({
                    "idFromClient": DateTime.now().ts ,
                    "additionnalInfos": {
                        "destinataire": phonePaiement,
                        "partner_name": "Swapp",
                        "return_url": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
                        "cancel_url": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference
                    },
                    "amount": prix_total,
                    "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
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
                    "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,   
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
                    "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,   
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
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.addWallet = async (req,res) => {

    
    
    
    

    try {

        let {
        
            panniers ,
        
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
    
            restaurant,
            
            addresseLivraion,
    
            addresseRestaurant
        
        } = req.body ;
    
    
        const pannierCommande = pannierCommandeModel();
    
        pannierCommande.reference = DateTime.now().ts;
    
        pannierCommande.panniers = panniers;
    
        pannierCommande.restaurant = restaurant;
    
        pannierCommande.client = req.user.id_user;
    
        pannierCommande.prix_total = prix_total;
    
        pannierCommande.prix_offre = prix_offre;
    
        pannierCommande.prix_livraison = prix_livraison ;
    
        pannierCommande.statusLivraison = statusLivraison;
    
        pannierCommande.pointDepart = pointDepart;
    
        pannierCommande.pointArrive = pointArrive;
    
        pannierCommande.contriePaiement = contriePaiement;
    
        pannierCommande.phonePaiement = phonePaiement;
    
        pannierCommande.means = means;
    
        pannierCommande.creneaux = creneaux;
    
        pannierCommande.addresseLivraion = addresseLivraion;
    
        pannierCommande.addresseRestaurant = addresseRestaurant;
    
        const pannierCommandeSave = await pannierCommande.save();
        
        const find = await walletModel.findOne({
            userId : req.user.id_user
        });

        console.log(find);
    
        if( find.balance >=  pannierCommandeSave.prix_total ) {
    
            pannierCommandeSave.status =  "SUCCESS";

            offreCommande.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');

            p = await pannierCommandeSave.save();
    
            for await (element of pannierCommandeSave.panniers) {
                // console.log(element);
                const p = await pannierModel.findById(element).exec();
    
                p.status = "accept";
    
                await p.save();
            }
    
            find.balance = find.balance - pannierCommandeSave.prix_total ;
    
            const findS = await find.save();
    
            return res.status(201).json({
                message: 'paiement réuissi',
                status: 'OK',
                data: pannierCommandeSave,
                statusCode: 201
            });
    
    
        }else {
            return res.status(404).json({
                message: 'erreur serveur',
                status: 'NOT OK',
                data: "solde insufisant",
                statusCode: 404
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

exports.addTable = async (req,res) => {

    
   try {
    let {
        
        panniers ,

        table,
    
        prix_total ,
    
        prix_offre ,

        phonePaiement,
        
        means,

        otp,

        restaurant,

    
    } = req.body ;

    const pannierCommande = pannierCommandeModel();
    
    pannierCommande.reference = DateTime.now().ts;

    pannierCommande.panniers = panniers;

    pannierCommande.restaurant = restaurant;

    pannierCommande.client = req.user.id_user;

    pannierCommande.prix_total = prix_total;

    pannierCommande.prix_offre = prix_offre;

    pannierCommande.table = table ;


    pannierCommande.phonePaiement = phonePaiement;

    pannierCommande.means = means;

    const pannierCommandeSave = await pannierCommande.save();

    const url = 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceGN+'/transaction?loginAgent='+process.env.loginAgentGN+'&passwordAgent='+process.env.passwordAgentGN;
    let data = {};
    if(means == "OM") { 
    
        data = JSON.stringify({
        "idFromClient": process.env.idFromClientGN,
        "amount": prix_total,
        "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
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
        "amount": prix_total,
        "callback": "https://api-swaped.deally.fr/v1/api/pannier-commande/success?reference="+pannierCommandeSave.reference,
        "recipientNumber": phonePaiement,
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
   } catch (error) {
    return res.status(404).json({
        message: 'erreur serveur',
        status: 'NOT OK',
        data: error,
        statusCode: 404
    });
   }

}

exports.addTableWallet = async (req,res) => {
    try {
        let {
        
            panniers ,
    
            table,
        
            prix_total ,
        
            prix_offre ,
    
            phonePaiement,
            
            means,
    
            otp,
    
            restaurant,
    
        
        } = req.body ;
    
        const pannierCommande = pannierCommandeModel();
        
        pannierCommande.reference = DateTime.now().ts;
    
        pannierCommande.panniers = panniers;
    
        pannierCommande.restaurant = restaurant;
    
        pannierCommande.client = req.user.id_user;
    
        pannierCommande.prix_total = prix_total;
    
        pannierCommande.prix_offre = prix_offre;
    
        pannierCommande.table = table ;
    
        pannierCommande.phonePaiement = phonePaiement;
    
        pannierCommande.means = means;
    
        const pannierCommandeSave = await pannierCommande.save();
    
      
    
            const find = await walletModel.findOne({
                userId : req.user.id_user
            });
    
            if( find.balance >=  pannierCommandeSave.prix_total ) {
    
                pannierCommandeSave.status =  "SUCCESS";

                offreCommande.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');
    
                const p = await pannierCommandeSave.save();
    
                for await (element of pannierCommandeSave.panniers) {
                    // console.log(element);
                    const p = await pannierModel.findById(element).exec();
        
                    p.status = "accept";
        
                    await p.save();
                }
    
                find.balance = find.balance - pannierCommandeSave.prix_total ;
    
                const findS = await find.save();
    
                return res.status(201).json({
                    message: 'paiement réuissi',
                    status: 'OK',
                    data: pannierCommandeSave,
                    statusCode: 201
                });
    
    
            }else {
                return res.status(404).json({
                    message: 'erreur serveur',
                    status: 'NOT OK',
                    data: "solde insufisant",
                    statusCode: 404
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

        const allOffre = await pannierCommandeModel.find().populate(populateObject).exec();

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

        const allOffre = await pannierCommandeModel.find({
            client : req.user.id_user
        }).populate(populateObject).exec();

        return res.status(201).json({
            message: 'liste commandes  clients',
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

        const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).exec();

        const allOffre = await pannierCommandeModel.find({
            restaurant : restaurant.id
        }).populate(populateObject).exec();

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

exports.updateStatusLivraison = async (req,res) => {
    
    try {

        const {etatLivraison}=req.body ;

        const pannier = await pannierCommandeModel.findById(req.params.id).exec();

        pannier.etatLivraison = etatLivraison ; 

        const pSave = await pannier.save();

        return res.status(201).json({
            message: 'modifications commande',
            status: 'OK',
            data: pSave,
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
        console.log(req.body);
    console.log(req.params);
    console.log(req.query);

    const offreCommande = await pannierCommandeModel.findOne({
        reference : req.query.reference
    }).exec();

    console.log(offreCommande.panniers);

  
    if (req.body.status == "SUCCESSFUL") {

        offreCommande.status =  "SUCCESS";

        for await (element of offreCommande.panniers) {
            // console.log(element);
            const p = await pannierModel.findById(element).exec();

            p.status = "accept";

            await p.save();
        }


    } else {

        offreCommande.status = "CANCELED";

        for await (element of offreCommande.panniers) {
            // console.log(element);

            const p = await pannierModel.findById(element).exec();

            console.log(p);

            p.status = "cancel";

            await p.save();
        }
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