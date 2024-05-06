const decaissementModel = require('../models/decaissement.js');

exports.add = async (req, res) => {



    try {

        let {


            decaissementitle,

            minPrice,

            maxPrice

        } = req.body;

        const decaissement = decaissementModel();

        decaissement.decaissementitle = decaissementitle;

        decaissement.minPrice = minPrice;

        decaissement.maxPrice = maxPrice;


        const decaissementSave = await decaissement.save();

        return res.status(201).json({
            message: 'Creation reussi',
            status: 'OK',
            data: decaissementSave,
            statusCode: 201
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

exports.all = async (req, res) => {

    try {

        const decaissements = await decaissementModel.find({}).exec();

        return res.status(200).json({
            message: 'listage reussi',
            status: 'OK',
            data: decaissements,
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

exports.one = async (req, res) => {

    try {

        const decaissement = await decaissementModel.findById(req.params.id).exec();

        return res.status(200).json({
            message: 'listage reussi',
            status: 'OK',
            data: decaissement,
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

exports.update = async (req, res) => {

    let {

        decaissementtitle,

        minPrice,

        maxPrice

    } = req.body;

    const decaissement = await decaissementModel.findById(req.params.id).exec();

    if (decaissementtitle != undefined) {
        decaissement.decaissementtitle = decaissementtitle;

    }

    if (minPrice != undefined) {
        decaissement.minPrice = minPrice;

    }

    if (maxPrice != undefined) {
        decaissement.maxPrice = maxPrice;

    }


    const decaissementSave = await decaissement.save();

    return res.status(200).json({
        message: 'update reussi',
        status: 'OK',
        data: decaissementSave,
        statusCode: 200
    });

    try {



    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }


}

exports.delete = async (req, res) => {
    try {
        const decaissement = await decaissementModel.findByIdAndDelete(req.params.id).exec();

        return res.status(200).json({
            message: 'delete reussi',
            status: 'OK',
            data: decaissement,
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