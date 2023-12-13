const deplacementModel = require("../models/deplacement");

const { DateTime } = require('luxon');

exports.store = async (req ,  res) => {

    try {
        
        let {
        
            prix_total,
        
            prix_offre ,    
        
            pointDepart ,
        
            pointArrive ,
        
            addresseDepart ,
        
            addresseArrive ,
        
            statusLivraison,
        
            phonePaiement,
        
            contriePaiement ,
        
            means,
    
        } = req.body ;
    
        const deplacement = deplacementModel();
    
        deplacement.reference  = DateTime.now().ts;
    
        deplacement.client = req.user.id_user;
    
        deplacement.prix_total = prix_total;
    
        deplacement.prix_offre = prix_offre;
    
        deplacement.pointDepart = pointDepart;
        
        deplacement.pointArrive = pointArrive;
    
        deplacement.addresseDepart = addresseDepart;
    
        deplacement.addresseArrive = addresseArrive;
    
        deplacement.statusLivraison = statusLivraison;
    
        deplacement.phonePaiement = phonePaiement;
    
        deplacement.contriePaiement = contriePaiement;
    
        deplacement.means = means;
    
        const deplaceSave = await deplacement.save();
    
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

exports.success = async (req,res)=> {

    

    try {
        console.log(req.body);
        console.log(req.params);
        console.log(req.query);

        const deplacement = await deplacementModel.findOne({
            reference : req.query.reference
        }).exec();


    
        if (req.body.status == "SUCCESSFUL") {

            deplacement.status =  "SUCCESS";

        } else {

            deplacement.status = "CANCELED";
        }
    
        deplacement.dateTransactionSuccess = new Date().toLocaleString().split('/').join("-");
    
    
        const tf = await deplacement.save();
    
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