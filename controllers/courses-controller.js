
const courseModel = require('../models/courses-model');

const vehiculeModel = require('../models/vehicule');

const reclamationModel = require('../models/reclamations');

const utiilsFnc = require('../utils/getLgLat');

const walletModel = require('../models/wallet');

const walletTransactionModel = require('../models/wallet-transactions');

const { DateTime } = require('luxon');

const { request } = require('urllib');


const axios = require('axios');


const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');

const objectPopulate = [{
    path : 'client',
    select : 'telephone nom prenom'
},{
    path : 'mobilite',
    populate : {
        path :'photoVehicule photoProfile'
    }
} , {
    path : 'transaction'
}];

const objectPopulateCommande = [{
    path : 'client',
    select : 'telephone nom prenom'
},{
    path : 'mobilite',
    populate : {
        path :'photoVehicule photoProfile'
    }
} , {
    path : 'transaction'
},{
    path : 'commande' , 
    populate : {
        path :'restaurant panniers'
    }
}];



exports.storeDeplacemnt = async (req,res ) => {

    


    try {
        
        let {
        
            prix_total,
        
            prix_offre,    
        
            pointDepart ,
        
            pointArrive ,
        
            addresseDepart,
        
            addresseArrive ,
        
            statusLivraison,
        
            statusDate ,
        
            dateCourses ,

            distance ,
        
            duree ,
    
            statusLivraisonVehicule
    
        } = req.body;
    
        const course = await courseModel();
    
        course.client = req.user.id_user;
        course.prix_total = prix_total;
        course.prix_offre = prix_offre;
        course.pointDepart = pointDepart;
        course.pointArrive = pointArrive;
        course.addresseDepart = addresseDepart;
        course.addresseArrive = addresseArrive;
        course.statusLivraison = statusLivraison;
        course.distance = distance;
        course.duree = duree;
        course.statusDate = statusDate;
        course.dateCourses = dateCourses;
        course.statusLivraisonVehicule = statusLivraisonVehicule;
    
        const courseS =await course.save();
    
        const vehicules = await vehiculeModel.find().exec();
    
        let vehiculeTab = [];
    
        let vehiculeResult = [];
    
        let vehiculeResultAffiche = [];
    
    
        for (const iterator of vehicules) {
    
            const result = {};
    
            if(iterator.typeVehicule == courseS.statusLivraisonVehicule ){
    
                result["info"] = await  utiilsFnc.getDistance(Object.fromEntries(courseS.pointDepart),Object.fromEntries(iterator.localisation) );
    
                result["vehicule"] = iterator ;
        
                vehiculeTab.push(result);
               
            }
            
    
        }
    
        vehiculeTab.sort((a, b) => a.info['distance']['value'] - b.info['distance']['value']);
    
        vehiculeResult = vehiculeTab;

        console.log( vehiculeResult.length);
    
        for (const it of vehiculeResult) {

            const vhFind = await vehiculeModel.findById(it.vehicule.id).exec();

            if (vhFind.coursesActif.indexOf(courseS.id) == -1) {
                vhFind.coursesActif.push(courseS.id);
            }

            const VHS = await vhFind.save();

            vehiculeResultAffiche.push(VHS);
        }
    
    
        let a = 0;

        const timer = setIntervalAsync(async () => {

            const courseF = await courseModel.findById(courseS.id).populate(objectPopulateCommande).exec();


            a++;

            console.log(a);

            

            if(a==1) {

                if(courseF.mobilite == null) {

                    courseF.courseCancelRaison = ["Le relais est pris par nos agents"] ;

                    courseF.statusCourses = 'cancel-server';

    

                    const courseSave = await courseF.save();


                    const vehicules = await vehiculeModel.find().exec();

                    for (const iterator of vehicules) {

                        if(iterator.coursesActif.includes(courseSave.id)) {

                            const vh =await vehiculeModel.findById(iterator.id).exec();

                            if(vh.courseSelected == courseSave.id ) {
                                vh.courseSelected = null ;
                                vh.online ="on";
                            }

                            vh.coursesActif.remove(courseSave.id);

                            const v =await vh.save();
                        }
                    }

                    // envoyer une reclamations

                    const reclamation = reclamationModel();

                    reclamation.ticketReclamation = DateTime.now().ts;
                    reclamation.obect = courseF.toJSON();
                    reclamation.type = "server";
                    reclamation.typeService =  "mobilite";

                    const rSave =await reclamation.save();

                    //SEND MESSAGE TO THIERNO

                    let data = JSON.stringify({
                        "outboundSMSMessageRequest": {
                            "address": "tel:+224626501651",
                            "senderAddress": "tel:+224626501651",
                            "senderName": "Deally",
                            "outboundSMSTextMessage": {
                            "message": "Une  course  n'a pas été acceptée ticket de réclation : "+rSave.ticketReclamation
                            }
                        }
                        });
                    
                        let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+224626501651/requests',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': 'Bearer '+req.accessToken
                        },
                        data : data
                        };
                    
                        axios.request(config)
                        .then((response) => {
                        console.log(JSON.stringify(response.data));
                        })
                        .catch((error) => {
                        console.log(error);
                        });

                        await clearIntervalAsync(timer);

                }else {

                    await clearIntervalAsync(timer);
                }
                            
            }

            
          }, 60 * 1000);
    
      
        return  res.status(201).json({
            message: 'Creation de courses',
            status: 'OK',
            data:{
                "course" :courseS,
                "liste-vehicule" :vehiculeResultAffiche 
            },
            statusCode: 201
        });
    
    } catch (error) {
        return res.status(404).json({
            message: 'erreur creation',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.storeLivraison = async (req,res ) => {

    console.log("exports.storeLivraison");


    try {
       
        let {

            client,
    
            commande,
        
            prix_total,
        
            prix_offre,    
        
            pointDepart ,
        
            pointArrive ,
        
            addresseDepart,
        
            addresseArrive ,
    
        } = req.body;
    
        const walletTransaction = walletTransactionModel();
    
        const find = await walletModel.findOne({
            userId : client
        });
    
        walletTransaction.amount = prix_offre ;
    
        walletTransaction.userWallet = find.id ;
    
        walletTransaction.reference = DateTime.now().ts ;
    
        walletTransaction.typeService = "recharge" ;
    
        walletTransaction.status = "SUCCESS" ;
    
        walletTransaction.dateTransactionSuccess =  DateTime.now().toFormat('dd-MM-yyyy'); ;
    
        walletTransaction.means = "SWAPED" ;
    
        const saveWalletTransaction = await  walletTransaction.save();
    
        const course = courseModel();
    
        course.client = client;
        course.commande = commande;
        course.transaction = saveWalletTransaction.id;
        course.prix_total = prix_total;
        course.prix_offre = prix_offre;
        course.pointDepart = pointDepart;
        course.pointArrive = pointArrive;
        course.addresseDepart = addresseDepart;
        course.addresseArrive = addresseArrive;
        course.statusLivraison = "livraison";
        course.statusLivraisonVehicule = "moto";
    
        const courseS =await course.save();
    
        const vehicules = await vehiculeModel.find().exec();
    
        let vehiculeTab = [];
    
        let vehiculeResult = [];
    
        let vehiculeResultAffiche = [];
    
    
        for (const iterator of vehicules) {
    
            const result = {};
    
            if(iterator.typeVehicule == courseS.statusLivraisonVehicule  ){
    
                result["info"] = await  utiilsFnc.getDistance(Object.fromEntries(courseS.pointDepart),Object.fromEntries(iterator.localisation) );
    
                result["vehicule"] = iterator ;
        
                vehiculeTab.push(result);
               
            }
            
    
        }
    
        vehiculeTab.sort((a, b) => a.info['distance']['value'] - b.info['distance']['value']);
    
        vehiculeResult = vehiculeTab;
    
        console.log( vehiculeResult.length);
    
        for (const it of vehiculeResult) {
    
            const vhFind = await vehiculeModel.findById(it.vehicule.id).exec();
    
            if (vhFind.coursesActif.indexOf(courseS.id) == -1) {
                vhFind.coursesActif.push(courseS.id);
            }
    
            const VHS = await vhFind.save();
    
            vehiculeResultAffiche.push(VHS);
        }
    
    
        let a = 0;
    
        const timer = setIntervalAsync(async () => {
    
            const courseF = await courseModel.findById(courseS.id).populate(objectPopulateCommande).exec();
    
    
            a++;
    
            if(a==1) {
    
                if(courseF.mobilite == null) {
    
                    courseF.courseCancelRaison = ["Le relais est pris par nos agents"] ;
    
                    courseF.statusCourses = 'cancel-server';
    
    
    
                    const courseSave = await courseF.save();
    
    
                    const vehicules = await vehiculeModel.find().exec();
    
                    for (const iterator of vehicules) {
    
                        if(iterator.coursesActif.includes(courseSave.id)) {
    
                            const vh =await vehiculeModel.findById(iterator.id).exec();
    
                            if(vh.courseSelected == courseSave.id ) {
                                vh.courseSelected = null ;
                                vh.online ="on";
                            }
    
                            vh.coursesActif.remove(courseSave.id);
    
                            const v =await vh.save();
                        }
                    }
    
                    // envoyer une reclamations
    
                    const reclamation = reclamationModel();
    
                    reclamation.ticketReclamation = DateTime.now().ts;
                    reclamation.obect = courseF.toJSON();
                    reclamation.type = "server";
                    reclamation.typeService =  "mobilite";
    
                    const rSave =await reclamation.save();
    
                    //SEND MESSAGE TO THIERNO
    
                    let data = JSON.stringify({
                        "outboundSMSMessageRequest": {
                            "address": "tel:+224626501651",
                            "senderAddress": "tel:+224626501651",
                            "senderName": "Deally",
                            "outboundSMSTextMessage": {
                            "message": "Une  livraison de repas n'a été envoyée ticket de réclation : "+rSave.ticketReclamation
                            }
                        }
                        });
                    
                        let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+224626501651/requests',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': 'Bearer '+req.accessToken
                        },
                        data : data
                        };
                    
                        axios.request(config)
                        .then((response) => {
                        console.log(JSON.stringify(response.data));
                        })
                        .catch((error) => {
                        console.log(error);
                        });
    
                    await clearIntervalAsync(timer);
    
                }
                            
            }else {

                await clearIntervalAsync(timer);
            }
    
            
          }, 60 * 1000);
    
          console.log(vehiculeResultAffiche);
      
    
        return  res.status(201).json({
            message: 'Creation de courses',
            status: 'OK',
            data:{
                "course" :courseS,
                "liste-vehicule" :vehiculeResultAffiche 
            },
            statusCode: 201
        });
    
    
    } catch (error) {
        return res.status(404).json({
            message: 'erreur creation',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
    

}

exports.anulerClient = async (req,res) => {

    
   try {

    let {
        courseCancelRaison
    } = req.body ;
    const course = await courseModel.findById(req.query.id).exec();



    course.courseCancelRaison = courseCancelRaison ;

    course.statusCourses = 'cancel-client';
    

    const courseSave = await course.save();


    const vehicules = await vehiculeModel.find().exec();

    for (const iterator of vehicules) {

        if(iterator.coursesActif.includes(courseSave.id)) {

            const vh =await vehiculeModel.findById(iterator.id).exec();

            if(vh.courseSelected == course.id ) {
                vh.courseSelected = null ;
                vh.online ="on";
            }

            vh.coursesActif.remove(courseSave.id);

            const v =await vh.save();
        }
    }

    return res.json({
        message : "annulation courses par client ",
        status : 200,
        data : courseSave,
        statusCode : 'OK'
    })
   } catch (error) {
        return res.status(404).json({
            message: 'erreur creation',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
   }
}

exports.all = async (req,res) => {
    try {

        const courses = await courseModel.find(req.query).populate(objectPopulate).exec();

        return  res.status(200).json({
            message: 'liste des courses',
            status: 'OK',
            data:courses,
            statusCode: 200
        });

        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur listage courses',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
}   


exports.one = async (req,res) => {

    try {
        const course = await courseModel.findById(req.params.id).populate(objectPopulate).exec();

        return res.json({
            message: 'liste des courses',
            status: 'OK',
            data:course,
            statusCode: 200
        })

    } catch (error) {
         return res.status(404).json({
            message: 'erreur listage courses',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }


}

exports.updateStatus = async (req,res) => {

    try {

        let {status} = req.query;
        const course = await courseModel.findById(req.params.id).populate(objectPopulate).exec();

        course.statusCourses = status;

        const courseS = await course.save();

        return res.json({
            message: 'update  status course',
            status: 'OK',
            data:courseS,
            statusCode: 200
        })

    } catch (error) {
         return res.status(404).json({
            message: 'erreur listage courses',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }


}


exports.addtransaction = async (req,res) => {


    

   try {
    
    let  {
    
        means,

        phone,

        otp,

        idCourses


    } =req.body;

    const course = await courseModel.findById(idCourses).exec();

    if(course != undefined) {

            const walletTransaction = walletTransactionModel();
    
            const find = await walletModel.findOne({
                userId : req.user.id_user
            });
    
            walletTransaction.amount = course.prix_total ;
    
            walletTransaction.userWallet = find.id ;
    
            walletTransaction.reference = DateTime.now().ts ;
    
            walletTransaction.means = means ;
    
            const saveWalletTransaction = await  walletTransaction.save();
    
            course.transaction = saveWalletTransaction.id ;
    
            const  courseS =  await course.save();
    
            const url = 'https://api.gutouch.com/dist/api/touchpayapi/v1/'+process.env.agenceGN+'/transaction?loginAgent='+process.env.loginAgentGN+'&passwordAgent='+process.env.passwordAgentGN;
            let data = {};
            if(means == "OM") {
            
                data = JSON.stringify({
                "idFromClient": process.env.idFromClientGN,
                "amount": courseS.prix_total,
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
                "amount": courseS.prix_total,
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
        
                    const transactionFind = await walletTransactionModel.findOne({
                        reference : saveWalletTransaction.reference
                    }).exec();
        
                    transactionFind.status = "SUCCESS";
        
                    transactionFind.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');
        
                    const tf = await transactionFind.save();
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
    } else {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: "course not found",
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

exports.addTransactionWallet = async (req,res)=> {

   

   try {

    let {idCourse} = req.body ;

    const course = await courseModel.findById(idCourse).populate(objectPopulate).exec();

    if(course != undefined) {

    
    
        const find = await walletModel.findOne({
            userId : req.user.id_user
        });


        if(find.balance >= course.prix_total ) {

            const walletTransaction = walletTransactionModel();

            walletTransaction.amount = course.prix_total ;

            walletTransaction.userWallet = find.id ;
    
            walletTransaction.reference = DateTime.now().ts ;
    
            walletTransaction.means = "SWAPED" ;
    
            walletTransaction.status = "SUCCESS";
    
            walletTransaction.dateTransactionSuccess = DateTime.now().toFormat('dd-MM-yyyy');
    
            const saveWalletTransaction = await  walletTransaction.save();
    
            course.transaction = saveWalletTransaction.id ;

            course.statusCourses ='paiement-client';
    
            const  courseS =  await course.save();

            const courseFindS = await courseModel.findById(courseS.id).populate(objectPopulate).exec()

            find.balance = find.balance - courseS.prix_total ;

            const findS = await find.save();

            return res.status(201).json({
                message: 'creation paiement',
                status: 'OK',
                data: saveWalletTransaction,
                statusCode: 404
            });

        }else {
            return res.status(404).json({
                message: 'erreur serveur',
                status: 'NOT OK',
                data: "solde insufisant",
                statusCode: 404
            });
        }
        }else {

            return res.status(404).json({
                message: 'erreur serveur',
                status: 'NOT OK',
                data: "course not found",
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


exports.fincourse = async (req,res) => {

    try {

        let { idCourses , note } = req.body;
        
        
        const course = await  courseModel.findById(idCourses).exec();

        course.statusCourses = "success";

        const courseS = await course.save();

        const vehicule =   await vehiculeModel.findById(courseS.mobilite).exec();

        vehicule.online = "on";

        vehicule.courseSelected = null ;

        vehicule.coursesActif = [];

        vehicule.notes.push(note);

        const vehiculeS = await vehicule.save();

        const updateWallet = await walletModel.findById(vehiculeS.walletDriver).exec();

        updateWallet.balance = updateWallet.balance + courseS.prix_offre;

        const updateWalletSave = await updateWallet.save();

        return res.json({
            message: 'fin courses des courses',
            status: 'OK',
            data:courseS,
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