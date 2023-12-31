const { DateTime } = require('luxon');
const biensModel = require('../models/biens');

const logementModel = require('../models/logement-model');

const reservationModel = require('../models/reservation');



const populateObject = [{
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
    
        const logement  =  await logementModel.findOne({
            idParent : req.user.id_user
        }).exec();
    
        const bien = biensModel();
    
        bien.adresse = adresse;
        bien.pays = logement.pays;
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

exports.update =  async (req,res) => {

    try {

        let {
            adresse,
        
            galery ,
        
            typeLogement ,
        
            titre ,

            description ,
        
            nbreChambre ,
        
            nbreLit ,

            nbreVoyageur ,
        
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
    
    
        const bien = await  biensModel.findById(req.params.id).exec();
    
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
    
       return res.status(200).json({
            message: 'biens modifier avec success',
            status: 'OK',
            data: findBien,
            statusCode: 200
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

exports.all = async (req,res) => {


    try {

        console.log(req.query);
    
        const biens = await biensModel.find(req.query).populate(populateObject).exec();
    
       return res.status(200).json({
            message: 'listes des biens success',
            status: 'OK',
            data: biens,
            statusCode: 200
        });
        
    } catch (error) {
        
       return res.status(400).json({
            message: 'erreur serveur',
            status: 'OK',
            data: error,
            statusCode: 400
        })

    }
}

exports.allByUser = async (req,res) => {


    try {
    
        const biens = await biensModel.find({
            idParent : req.user.id_user
        }).populate(populateObject).exec();
    
       return res.status(200).json({
            message: 'listes des biens success',
            status: 'OK',
            data: biens,
            statusCode: 200
        });
        
    } catch (error) {
        
       return res.status(400).json({
            message: 'erreur serveur',
            status: 'OK',
            data: error,
            statusCode: 400
        })

    }
}



exports.allBySearch = async (req,res) => {

    try {
        let {
            localistaion ,
            debut,
            fin,
            voyageur,
            nuits,
            maxPrice,
            minPrice,
            chambre
        } = req.query ;

        console.log(localistaion.split(',')[0]);
    
        const biens = await biensModel.find(
            {
                nbreChambre : {
                    $gte : Number(chambre)
                },
                nbreVoyageur : {
                    $gte : Number(voyageur)
                },
    
                nbreMinNuit : {
                    $lte : Number(nuits)
                },
    
                tarif : {
                    $gte: minPrice, 
                    $lte: maxPrice, 
                },
    
                adresse: { 
                    $regex: new RegExp(localistaion.split(',')[0], 'i') 
                },  


            }
        ).populate(populateObject).exec();

        const dateDebut =  Date.parse(debut);
        const dateFin =  Date.parse(fin);

        const biensFinal = [];
        

        for (const iterator of biens) {
            
            var b  = Object.assign(iterator);
            let biensActif = 0 ;
           for (const it of b.reservations) {
            
                var t = Object.assign(it);

                if((dateDebut - Date.parse(t.dateDebut)   >= 0 && dateDebut -  Date.parse(t.dateFin)   <= 0) || (dateFin - Date.parse(t.dateDebut)   >= 0 && dateFin -  Date.parse(t.dateFin)   <= 0)    ){

                    biensActif = 1;

                }

           }
           if (biensActif == 0) {
            biensFinal.push(iterator);
           }
        }

       return res.status(200).json({
            message: 'listes des biens success',
            status: 'OK',
            data:  biens,
            statusCode: 200
        });
    } catch (error) {

        return res.status(400).json({
            message: 'erreur serveur',
            status: 'OK',
            data: error,
            statusCode: 400
        })

    }

}


exports.one = async (req,res) => {


    try {
    
    
        const bien = await biensModel.findById(req.params.id).populate(populateObject).exec();
    
    
       return res.status(200).json({
            message: 'Biens success',
            status: 'OK',
            data: bien,
            statusCode: 200
        });
        
    } catch (error) {
        
       return res.status(400).json({
            message: 'erreur serveur',
            status: 'OK',
            data: error,
            statusCode: 400
        })

    }
}

exports.delete = async (req,res) => {


    try {
    
    
        const bien = await biensModel.findByIdAndDelete(req.params.id).exec();
    
    
       return res.status(200).json({
            message: 'Biens success',
            status: 'OK',
            data: bien,
            statusCode: 200
        });
        
    } catch (error) {
        
       return res.status(400).json({
            message: 'erreur serveur',
            status: 'OK',
            data: error,
            statusCode: 400
        })

    }
}