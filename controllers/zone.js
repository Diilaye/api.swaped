const zoneModel = require('../models/zone.js');

exports.add = async (req, res) => {

    try {

        let {

            depart,

            arrive,

            prix
        } = req.body;

        const zone = zoneModel();

        zone.depart = depart;

        zone.arrive = arrive;

        zone.prix = prix;

        zone.zonetitle = depart + '-' + arrive;

        const zoneSave = await zone.save();

        return res.status(201).json({
            message: 'Creation reussi',
            status: 'OK',
            data: zoneSave,
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

        const zones = await zoneModel.find({}).exec();

        return res.status(200).json({
            message: 'listage reussi',
            status: 'OK',
            data: zones,
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

        const zone = await zoneModel.findById(req.params.id).exec();

        return res.status(200).json({
            message: 'listage reussi',
            status: 'OK',
            data: zone,
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

    try {

        let { depart, arrive, prix } = req.body;

        const zone = await zoneModel.findById(req.params.id).exec();

        if (depart != undefined && arrive != undefined) {
            zone.zonetitle = depart + '-' + arrive;
            zone.arrive = arrive;
            zone.depart = depart;
        }

        if (depart != undefined && arrive == undefined) {
            zone.zonetitle = depart + '-' + zone.arrive;
            zone.depart = depart;

        }

        if (depart === undefined && arrive != undefined) {
            zone.zonetitle = zone.depart + '-' + arrive;
            zone.arrive = arrive;

        }

        if (prix != undefined) {
            zone.prix = prix;
        }

        const zoneSave = await zone.save();

        return res.status(200).json({
            message: 'update reussi',
            status: 'OK',
            data: zoneSave,
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

exports.delete = async (req, res) => {
    try {
        const zone = await zoneModel.findByIdAndDelete(req.params.id).exec();

        return res.status(200).json({
            message: 'delete reussi',
            status: 'OK',
            data: zone,
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