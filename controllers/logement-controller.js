const logementModel = require('../models/logement-model');


const populateObject = [{
    path :'photoCover'
},{
    path : 'gallerie'
},{
    path : 'biens' ,
    populate :  [{
        path :'galery'
    }]
}];


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
       return res.status(404).json({
            message: 'erreur server',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }


}

exports.all = async (req,res) => {

    try {

        const logements = await logementModel.find(req.query).populate(populateObject).exec();

        return res.status(200).json({
            message: 'listage logement réussi',
            status: 'OK',
            data: logements,
            statusCode: 200
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur server',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.one = async (req,res) => {

    try {

        const logements = await logementModel.findById(req.params.id).populate(populateObject).exec();

        return res.status(200).json({
            message: 'listage logement réussi',
            status: 'OK',
            data: logements,
            statusCode: 200
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur server',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }

}