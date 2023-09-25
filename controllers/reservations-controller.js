const reservationModel = require('../models/reservation');
const bienModel = require('../models/biens');

const prospectModel = require('../models/user-prospect-model');

const populateObject = [{
    path :'bien',
    populate : [{
        path :'galery'
    }]
},{
    path : 'client'
},{
    path : 'user'
} ,{
    path :'messages'
},{
    path :'prospect'
}];

const populateObjectBiens = [{
    path :'galery'
},{
    path :'reservations',
    select:'dateDebut dateFin'
}];

exports.add = async (req,res) => {


    try {

        let {
            adresse,
        
            galery ,
        
            typeLogement ,
        
            titre ,

            description ,
        
            nbreChambre ,
        
            nbreVoyageur ,

            nbreLit ,
        
            nbreSalleBain ,
        
            commoditeChambre ,
        
            commoditeSalon ,
        
            commoditeCuisine ,
        
            commoditeSalleBain ,
        
            commoditeBuanderie ,
        
            commoditeJardin ,
        
            commoditeServiceAnnexe ,
        
            nbreMinNuit  ,
        
            tarif  ,
        
            tarifLocataireSupplementaire ,
        
            tarif_menagere ,

            conditionAnulation
    
    
        } = req.body;
    
    
        const bien = biensModel();
    
        bien.adresse = adresse;
        bien.galery = galery;
        bien.typeLogement = typeLogement;
        bien.titre = titre;
        bien.description = description;
        bien.nbreChambre = nbreChambre;
        bien.nbreLit = nbreLit;
        bien.nbreVoyageur = nbreVoyageur;
        bien.nbreSalleBain = nbreSalleBain;
        bien.commoditeChambre = commoditeChambre;
        bien.commoditeSalon = commoditeSalon;
        bien.commoditeCuisine = commoditeCuisine;
        bien.commoditeSalleBain = commoditeSalleBain;
        bien.commoditeBuanderie = commoditeBuanderie;
        bien.commoditeJardin = commoditeJardin;
        bien.commoditeServiceAnnexe = commoditeServiceAnnexe;
        bien.nbreMinNuit = nbreMinNuit;
        bien.tarif = tarif;
        bien.tarifLocataireSupplementaire = tarifLocataireSupplementaire;
        bien.tarif_menagere = tarif_menagere;
        bien.conditionAnulation = conditionAnulation;
        bien.idParent = req.user.id_user;
    
        const saveBien =  await bien.save();

        const findBien = await biensModel.findById(saveBien.id).populate(populateObject).exec();



        const logement  =  await logementModel.findOne({
            idParent : req.user.id_user
        }).exec();

        logement.biens.push(saveBien);

        await logement.save();
    
       return res.status(201).json({
            message: 'biens créer avec success',
            status: 'OK',
            data: findBien,
            statusCode: 201
        });
        
    } catch (error) {
        
       return res.status(400).json({
            message: 'erreur serveur',
            status: 'OK',
            data: error,
            statusCode: 400
        });

    }
}

exports.add = async (req, res) => {

    try {
        
        let {

            bien ,
        
            dateDebut ,
        
            dateFin ,

            nbreVoyageur ,

            nbreChambre ,
    
        } =req.body ;
    
        const findBien = await bienModel.findById(bien).populate(populateObjectBiens).exec();

        const debut =  Date.parse(dateDebut);
        const fin =  Date.parse(dateFin);


        if (findBien != undefined) {

            var b  = Object.assign(findBien);
            let biensActif = 0 ;
           for (const it of b.reservations) {
            
                var t = Object.assign(it);

                if((debut - Date.parse(t.dateDebut)   >= 0 && debut -  Date.parse(t.dateFin)   <= 0) || (fin - Date.parse(t.dateDebut)   >= 0 && fin -  Date.parse(t.dateFin)   <= 0)    ){

                    biensActif = 1;

                }

           }
           if (biensActif == 0) {
                const reservation = reservationModel();
        
                reservation.bien = bien ;
                reservation.user = findBien.idParent ;
                reservation.client = req.user.id_user ;
                reservation.dateDebut = new Date(dateDebut) ;
                reservation.dateFin = new  Date(dateFin) ;
                reservation.nbreVoyageur = nbreVoyageur ;
                reservation.nbreChambre = nbreChambre ;
            
                const saveReservation = await reservation.save();

                findBien.reservations.push(saveReservation.id);

                await findBien.save();
            
                return  res.status(201).json({
                    message: 'creation réussi',
                    status: 'OK',
                    data: "saveReservation",
                    statusCode: 201
                });
           }else {
            return res.status(403).json({
                message: 'erreur supréssion ',
                statusCode: 403,
                data: "Date insdisponible",
                status: 'NOT OK'
            });
           }

           
        }else {
            return res.status(404).json({
                message: 'erreur supréssion ',
                statusCode: 404,
                data: "error",
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

exports.addProspect = async (req, res) => {

    try {
        
        let {

            bien ,
        
            dateDebut ,
        
            dateFin ,

           nomComplet,

           telephone,
    
        } =req.body ;
    
        const findBien = await bienModel.findById(bien).exec();

        const debut =  Date.parse(dateDebut);
        const fin =  Date.parse(dateFin);

        if (findBien != undefined) {

            var b  = Object.assign(findBien);
            let biensActif = 0 ;
           for (const it of b.reservations) {
            
                var t = Object.assign(it);

                if((debut - Date.parse(t.dateDebut)   >= 0 && debut -  Date.parse(t.dateFin)   <= 0) || (fin - Date.parse(t.dateDebut)   >= 0 && fin -  Date.parse(t.dateFin)   <= 0)    ){

                    biensActif = 1;

                }

           }

           if (biensActif == 0) {
            const reservation = reservationModel();

            const prospect = prospectModel();

            prospect.nomComplet = nomComplet;
            prospect.telephone = telephone;

            const saveProspect = await prospect.save();
    
            reservation.bien = bien ;
            reservation.user = findBien.idParent ;
            reservation.prospect =  saveProspect.id ;
            reservation.dateDebut = new Date(dateDebut) ;
            reservation.dateFin = new  Date(dateFin) ;
            reservation.status = "create-partenaire" ;
            reservation.nbreVoyageur = findBien.nbreVoyageur ;
            reservation.nbreChambre = findBien.nbreChambre ;
        
            const saveReservation = reservation.save();
        
            return  res.status(201).json({
                message: 'creation réussi',
                status: 'OK',
                data: saveReservation,
                statusCode: 201
            });

           } else {
                return res.status(404).json({
                    message: 'erreur supréssion ',
                    statusCode: 404,
                    data: "error",
                    status: 'NOT OK'
                });
           }

           
        }else {
            return res.status(404).json({
                message: 'erreur supréssion ',
                statusCode: 404,
                data: "error",
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

exports.all = async (req,res) => {
    try {
        const reservations = await  reservationModel.find({}).populate(populateObject).exec();
    
    
        return  res.status(200).json({
            message: 'listage réussi',
            status: 'OK',
            data: reservations,
            statusCode: 201
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

exports.allByClient = async (req,res) => {

  
    try {
        const reservations = await  reservationModel.find({
            client : req.user.id_user
        }).populate(populateObject).exec();
    
    
        return  res.status(200).json({
            message: 'listage réussi',
            status: 'OK',
            data: reservations,
            statusCode: 201
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

exports.allByLogement = async (req,res) => {

    try {



        const reservations = await  reservationModel.find({
            user : req.user.id_user
        }).populate(populateObject).exec();
    
    
        return  res.status(200).json({
            message: 'listage réussi',
            status: 'OK',
            data: reservations,
            statusCode: 201
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

exports.update = async (req,res)=> {
    

    try {
        let {

            bien ,
        
            client,
        
            dateDebut ,
        
            dateFin,
        
            status,
        
            userCancel ,
        
            transaction ,
            
        
            motifsCancel ,
    
        } = req.body;
    
        const findReservation = await reservation.findById(req.params.id).populate(populateObject).exec();
    
        if (bien !=undefined) {
            
            const findBien = await bienModel.findById(bien).exec();
            
            if (findBien != undefined) {
                findReservation.bien = bien ;
                findReservation.user = findBien.idParent;
            }else {
                return res.status(404).json({
                    message: 'erreur supréssion ',
                    statusCode: 404,
                    data: "error",
                    status: 'NOT OK'
                });
            }
    
        }
    
        if (client !=undefined) {
            findReservation.client = client ;
        }
    
        if (dateDebut !=undefined) {
            findReservation.dateDebut = dateDebut ;
        }
    
        if (dateFin !=undefined) {
            findReservation.dateFin = dateFin ;
        }
    
        if (status !=undefined) {
            findReservation.status = status ;
        }
    
        if (userCancel !=undefined) {
            findReservation.userCancel = userCancel ;
        }
    
        if (transaction !=undefined) {
            findReservation.transaction = transaction ;
        }
    
        if (motifsCancel !=undefined) {
            findReservation.motifsCancel = motifsCancel ;
        }
    
        const saveReservation = await findReservation.save();
    
        return  res.status(200).json({
            message: 'modification réussi',
            status: 'OK',
            data: saveReservation,
            statusCode: 201
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

exports.updatePartenaire = async (req,res)=> {
   

    try {
         
    let {

        bien ,
    
        client,
    
        dateDebut ,
    
        dateFin,
    
        status,
    
        userCancel ,
    
        transaction ,
        
    
        motifsCancel ,

    } = req.body;

    const findReservation = await reservationModel.findById(req.params.id).populate(populateObject).exec();

    if (bien !=undefined) {
        
        const findBien = await bienModel.findById(bien).exec();
        
        if (findBien != undefined) {
            findReservation.bien = bien ;
            findReservation.user = findBien.idParent;
        }else {
            return res.status(404).json({
                message: 'erreur supréssion ',
                statusCode: 404,
                data: "error",
                status: 'NOT OK'
            });
        }

    }

    if (client !=undefined) {
        findReservation.client = client ;
    }

    if (dateDebut !=undefined) {
        findReservation.dateDebut = dateDebut ;
    }

    if (dateFin !=undefined) {
        findReservation.dateFin = dateFin ;
    }

    if (status !=undefined) {
        findReservation.status = status ;
    }

    if (userCancel !=undefined) {
        findReservation.userCancel = userCancel ;
    }

    if (transaction !=undefined) {
        findReservation.transaction = transaction ;
    }

    if (motifsCancel !=undefined) {
        findReservation.motifsCancel = motifsCancel ;
    }

    const saveReservation = await findReservation.save();

    return  res.status(200).json({
        message: 'modification réussi',
        status: 'OK',
        data: saveReservation,
        statusCode: 201
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

exports.delete = async (req,res) => {

}