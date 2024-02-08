const reclamationModel = require('../models/reclamations');



exports.all = async (req, res) => {


        try {

            const reclamations = await reclamationModel.find();

            return  res.status(201).json({
                message: 'liste des reclamations',
                status: 'OK',
                data: reclamations,
                statusCode: 201
            });
            
        } catch (error) {
           return res.status(404).json({
                message: 'erreur serveur  ',
                status: 'NOT OK',
                data: error,
                statusCode: 404
            });
        }


}