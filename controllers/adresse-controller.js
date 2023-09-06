const adresseModel = require('../models/adresse');

const {getLgLat} = require('../utils/getLgLat');

exports.add = async (req,res) => {

   try {

        let {
            localisation,
            type
        } = req.body ;

        const point = await getLgLat(localisation);

        const adresse = adresseModel() ;

        adresse.type = type ;

        adresse.localisation = point ;

        adresse.user = req.user.id_user;

        adresse.rue = localisation.split(',')[0] ;

        adresse.ville = localisation.split(',')[localisation.split(',').length - 2];

        adresse.pays = localisation.split(',')[localisation.split(',').length - 1];

        const adresseSave = await adresse.save();

        return res.status(201).json({
            message: 'addresse créer avec success',
            status: 'OK',
            data: adresseSave,
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
    const adresses = await adresseModel.find(req.query).exec();

    return res.status(200).json({
        message: 'liste de addresse avec success',
        status: 'OK',
        data: adresses,
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

exports.one = async (req,res) => {
    
    try {
     const adresses = await adresseModel.findById(req.params.id).exec();
 
     return res.status(200).json({
         message: 'liste de addresse avec success',
         status: 'OK',
         data: adresses,
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

exports.allByUser = async (req,res) => {

    try {
        const adresses = await adresseModel.find({
                user : req.user.id_user
            }).exec();
    
        return res.status(200).json({
            message: 'liste de addresse avec success',
            status: 'OK',
            data: adresses,
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

exports.update = async (req,res) => {

    try {

        let {
            localisation,
            type
        } = req.body ;

        const point = await getLgLat(localisation);

        const adresse = adresseModel.findById(req.params.id) ;

        adresse.type = type ;

        adresse.localisation = point ;

        adresse.rue = localisation.split(',')[0] ;

        adresse.ville = localisation.split(',')[localisation.split(',').length - 2];

        adresse.pays = localisation.split(',')[localisation.split(',').length - 1];

        const adresseSave = await adresse.save();

        return res.status(200).json({
            message: 'addresse créer avec success',
            status: 'OK',
            data: adresseSave,
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

exports.delete = async (req,res) => {

    try {
        const adresse = await adresseModel.findByIdAndDelete(req.params.id).exec();

    return res.status(200).json({
        message: 'addresse suprimer avec success',
        status: 'OK',
        data: adresse,
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
