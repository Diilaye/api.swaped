const logementModel = require('../models/logement-model');

exports.add = async (req,res) => {

    try {
        
        let {

            service,
        
            idParent ,
        
            nomEntreprise ,
        
            descriptionEntreprise,

            photoCover,
            
            gallerie,
    
    
        } = req.body;
    
        const logement = logementModel();
    
        logement.service = service;
    
        logement.idParent = idParent;
    
        logement.nomEntreprise = nomEntreprise;
    
        logement.descriptionEntreprise = descriptionEntreprise;
    
        logement.photoCover = photoCover;
    
        logement.gallerie = gallerie;
    
        const logementSave = await logement.save();
    
        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: logementSave,
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