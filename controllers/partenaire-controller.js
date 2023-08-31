const partenaireModel = require('../models/partenaires-models');

const adminModel = require('../models/admin');

const logementModel = require('../models/logement-model');

const bcrytjs = require('bcryptjs');


const salt = bcrytjs.genSaltSync(10);

const jwt = require('jsonwebtoken');

require('dotenv').config({
    path: './.env'
});


const populateObject = [{
    path :'photoExterieur'
},{
    path:'photoInterne'
}];


exports.add = async (req,res)  => {

try {

    
    let {

        service,
    
        nomEntreprise ,
    
        descriptionEntreprise ,
    
        nomInterlocuteur ,
    
        prenomInterlocuteur ,
        
        telephoneInterlocuteur ,
    
        photoExterieur ,
    
        photoInterne ,
    
        localisation,
    
        dateRv ,
    
        heureRv ,

    } = req.body;


    let partenaire = partenaireModel();

    partenaire.service = service;
    partenaire.nomEntreprise = nomEntreprise;
    partenaire.descriptionEntreprise = descriptionEntreprise;
    partenaire.nomInterlocuteur = nomInterlocuteur;
    partenaire.prenomInterlocuteur = prenomInterlocuteur;
    partenaire.telephoneInterlocuteur = telephoneInterlocuteur;
    partenaire.photoExterieur = photoExterieur;
    partenaire.photoInterne = photoInterne;
    partenaire.localisation = localisation;
    partenaire.dateRv = dateRv;
    partenaire.heureRv = heureRv;

    const savePartenaire = await partenaire.save();

    const findPartenaire = await partenaireModel.findById(savePartenaire.id).populate(populateObject).exec();

   return  res.json({
        message: 'creation réussi',
        status: 'OK',
        data: findPartenaire,
        statusCode: 201
    });

} catch (error) {

    return res.json({
        message: 'erreur supréssion ',
        statusCode: 404,
        data: error,
        status: 'NOT OK'
    });
    }

}

exports.addPartenaire = async (req,res ,next) => {

   

        try {

            let {

                id,
        
                service,
        
                nom ,
            
                prenom,
        
                nomEntreprise
            
            } = req.body;
        
            
        
           
                if(service =="admin") {
                     return res.status(404).json({
                        message: 'erreur serveur ',
                        statusCode: 404,
                        data: "Vous pouvez pas enregister un admin",
                        status: 'NOT OK'
                    });
                }
            
                const partenaireFind = await partenaireModel.findById(id).populate(populateObject).exec(); 
        
                partenaireFind.status = "active";
        
                const partenaireSave = await partenaireFind.save();
            
                const passwordCrypt = bcrytjs.hashSync("swaped123", salt);
            
                const user = adminModel();
            
                user.service = service;
            
                user.nom = nom;
            
                user.prenom = prenom;
            
                user.password = passwordCrypt;
            
                user.identifiant = nom.toLowerCase() + "." + nomEntreprise.split(' ')[0].toLowerCase();
            
                const token = jwt.sign({
                    id_user: user.id,
                    service_user : user.service , 
                    identifiant_user : user.identifiant
                }, process.env.JWT_SECRET, { expiresIn: '8784h' });
            
                user.token = token;
                
                
                const userSave = await user.save();
        
               
                if (service == "logement") {
        
                    const logement = logementModel();
        
                    logement.service = "logement";
                    logement.idParent = userSave.id;
                    logement.nomEntreprise = partenaireFind.nomEntreprise ;
                    logement.descriptionEntreprise = partenaireFind.descriptionEntreprise ;
                    logement.photoCover = partenaireFind.photoExterieur[0] ;
                    logement.gallerie = [...partenaireFind.photoExterieur, ...partenaireFind.photoInterne]  ;
        
                    const saveLogement = await logement.save();
                    
        
                }else if(service =="restaurant"){
        
                }else {
        
                }
            
                return  res.status(201).json({
                    message: 'creation réussi',
                    status: 'OK',
                    data: userSave,
                    statusCode: 201
                });
            
        
        } catch (error) {
            res.status(404).json({
                message: 'erreur server',
                status: 'OK',
                data: error,
                statusCode: 404
            })
        }
        


}

exports.all = async (req,res) => {

    try {
        const partenaires = await partenaireModel.find(req.query).populate(populateObject).exec(); 
        res.status(201).json({
            message: 'Partenaires trouvée avec succes',
            status: 'OK',
            data: partenaires,
            statusCode: 201
        })
    } catch (error) {
        res.status(404).json({
            message: 'Partenaires non trouvée',
            status: 'OK',
            data: error,
            statusCode: 404
        })
    }

}

exports.one = async (req,res) => {

    try {
        const partenaires = await partenaireModel.findById(req.params.id).populate(populateObject).exec(); 
        res.status(201).json({
            message: 'Partenaires trouvée avec succes',
            status: 'OK',
            data: partenaires,
            statusCode: 201
        })
    } catch (error) {
        res.status(404).json({
            message: 'Partenaires non trouvée',
            status: 'OK',
            data: error,
            statusCode: 404
        })
    }

}

exports.update = async (req,res) =>{

    try {
        let {

            service,
        
            nomEntreprise ,
        
            descriptionEntreprise ,
        
            nomInterlocuteur ,
        
            prenomInterlocuteur ,
            
            telephoneInterlocuteur ,
        
            photoExterieur ,
        
            photoInterne ,
        
            localisation,
        
            dateRv ,
        
            heureRv ,
    
        } = req.body;
    
    
        const partenaireFind = await partenaireModel.findById(req.params.id).populate(populateObject).exec();
    
        if (service != undefined) {
            partenaireFind.service = service;
        }
    
        if (nomEntreprise != undefined) {
            partenaireFind.nomEntreprise = nomEntreprise;
        }
    
        if (descriptionEntreprise != undefined) {
            partenaireFind.descriptionEntreprise = descriptionEntreprise;
        } 
    
        if (nomInterlocuteur != undefined) {
            partenaireFind.nomInterlocuteur = nomInterlocuteur;
        }
    
        if (prenomInterlocuteur != undefined) {
            partenaireFind.prenomInterlocuteur = prenomInterlocuteur;
        }
    
        if (telephoneInterlocuteur != undefined) {
            partenaireFind.telephoneInterlocuteur = telephoneInterlocuteur;
        }  
        
        if (photoExterieur != undefined) {
            partenaireFind.photoExterieur = photoExterieur;
        }  
        
        if (photoInterne != undefined) {
            partenaireFind.photoInterne = photoInterne;
        }  
        
        if (localisation != undefined) {
            partenaireFind.localisation = localisation;
        }  
        
        if (dateRv != undefined) {
            partenaireFind.dateRv = dateRv;
        }
    
        if (heureRv != undefined) {
            partenaireFind.heureRv = heureRv;
        }
    
        const partenaireSave = await partenaireFind.save();
    
    
        const findPartenaire = await partenaireModel.findById(partenaireSave.id).populate(populateObject).exec();
    
        return  res.json({
             message: 'update réussi',
             status: 'OK',
             data: findPartenaire,
             statusCode: 201
         });
    } catch (error) {
        res.status(404).json({
            message: 'Partenaires non trouvée',
            status: 'OK',
            data: error,
            statusCode: 404
        })
    }


}

exports.suspendre = async (req,res) =>{

   try {
    const partenaireFind = await partenaireModel.findById(req.params.id).populate(populateObject).exec();

    partenaireFind.status = "canceled";

    const savePartenaire = await partenaireFind.save();


    return  res.status(200).json({
        message: 'update réussi',
        status: 'OK',
        data: savePartenaire,
        statusCode: 200
    });
   } catch (error) {
    return  res.status(404).json({
        message: 'Partenaires non trouvée',
        status: 'OK',
        data: error,
        statusCode: 404
    });
   }

}