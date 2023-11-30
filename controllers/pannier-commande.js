
const pannierCommandeModel = require('../models/pannier-commande');

const pannierModel = require('../models/pannier');


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
    
            restaurant
        
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

exports.all = async (req,res) => {

    try {

        const allOffre = await pannierCommandeModel.find().exec();

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

        const allOffre = await pannierCommandeModel.find({
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
        const offreCommande = await pannierCommandeModel.findOne({
            reference : req.query.reference
        }).exec();
      
        if (req.body.status == "SUCCESSFUL") {
            offreCommande.status =  "SUCCESS";

            for await (element of offreCommande.panniers) {
                const p = await pannierModel.findById(element).excec();
    
                p.status = "accept";

                await p.save();
            }


        } else {

            offreCommande.status = "CANCELED";

            for await (element of offreCommande.panniers) {
                const p = await pannierModel.findById(element).excec();
    
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