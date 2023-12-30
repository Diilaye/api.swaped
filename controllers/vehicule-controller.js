const vehiculeModel = require('../models/vehicule');

exports.all = async (req,res )=> {
    try {
        const vehicules = await vehiculeModel.find();

        return res.json({
            message : "listes des vehicules",
            status : 200,
            data : vehicules,
            statusCode : 'OK'
        });
    } catch (error) {
        return res.status(404).json({
            message : "error data",
            status : 404,
            data : error,
            statusCode : 'NOT OK'
        });
    }
}