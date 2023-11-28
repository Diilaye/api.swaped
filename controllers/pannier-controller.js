const pannierModel = require('../models/pannier');

const platModel = require('../models/plats-model');

const populateObject = [{
    path :'plat',
    populate : [{
    path : 'galery'
}]
}];

exports.add = async (req, res) => {

    try {
        const {
            plat,
            quantity,
            complements,
            prix_total
        } = req.body ;
    
        const plats = await platModel.findById(plat).exec();
    
        if(plats) {
    
            const pannier = pannierModel();
    
            pannier.quantity =  quantity;
        
            pannier.plat  = plats.id;
        
            pannier.restaurant = plats.idRestaurant;
        
            pannier.client = req.user.id_user;
        
            pannier.complements = complements;
          
            pannier.prix_total  = prix_total;
    
            const pannierSave = await pannier.save();
    
            return res.status(201).json({
                message: 'add pannier',
                status: 'OK',
                data: pannierSave,
                statusCode: 404
            });
    
        }else {
            return res.status(404).json({
                message: 'erreur serveur',
                status: 'NOT OK',
                data: "Offre not found",
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

exports.byClient = async (req,res) => {
    try {

        const pannierClient = await pannierModel.find({
            client : req.user.id_user,
            restaurant : req.query.idRestaurant
        }).populate(populateObject).exec();
        
        return res.status(200).json({
            message: 'pannier Client pannier',
            status: 'OK',
            data: pannierClient,
            statusCode: 404
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
 
exports.deleteComplement = async (req ,res ) => {

    try {
        const pannierClient = await pannierModel.findById(req.params.id);

        pannierClient.complements = [];

        const pSve = await pannierClient.save(); 

        return res.status(200).json({
            message: 'update Client pannier',
            status: 'OK',
            data: pSve,
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

exports.delete = async (req, res ) => {

    try {
        const pannierClient = await pannierModel.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({
            message: 'pannier Client pannier',
            status: 'OK',
            data: pannierClient,
            statusCode: 404
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