const partenaireModel = require('../models/partenaires-models');

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

    console.log(req.body);

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

   return  res.json({
        message: 'creation réussi',
        status: 'OK',
        data: savePartenaire,
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