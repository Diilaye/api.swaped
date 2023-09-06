const biensModel = require('../models/biens');

const logementModel = require('../models/logement-model');


const populateObject = [{
    path :'galery'
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
    
    
        } = req.body;
    
    
        const bien = biensModel();
    
        bien.adresse = adresse;
        bien.galery = galery;
        bien.typeLogement = typeLogement;
        bien.titre = titre;
        bien.description = description;
        bien.nbreChambre = nbreChambre;
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

exports.all = async (req,res) => {


    try {
    
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
                    $regex: new RegExp(localistaion, 'i') 
                },  
            }
        ).populate(populateObject).exec();
    
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