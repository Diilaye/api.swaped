
const zoneModel = require('../models/zone.js');

exports.add = async (req, res) => {




    try {

        let {
            title
        } = req.body;

        const zone = zoneModel();

        const zoneF = await zoneModel.find().exec();

        if (zoneF.length > 0) {
            for (const object of zoneF) {
                const zoneFS = await zoneModel.findById(object.id).exec();

                zoneFS.subZone.push({
                    arrive: title,
                    prix: 0
                });

                zone.subZone.push({
                    arrive: zoneFS.title,
                    prix: 0
                });

                const zoneFSS = await zoneFS.save();
            }
        }


        zone.title = title;

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

        let { title, subZone } = req.body;

        const zone = await zoneModel.findById(req.params.id).exec();

        if (title != undefined) {

            const zones = await zoneModel.find().exec();


            for (const iterator of zones) {

                const zoneF = await zoneModel.findById(iterator.id).exec();

                let b = zoneF.subZone.findIndex((value) => {

                    const object = Object.fromEntries(value);

                    return object.arrive == zone.title;
                });

                if (b > -1) {
                    const c = zoneF.subZone.splice(b, 1);
                    zoneF.subZone.push({
                        arrive: title,
                        prix: c[0].get('prix')
                    })
                }

                await zoneF.save();

            }

            zone.title = title;

        }

        if (subZone != undefined) {
            zone.subZone = subZone;
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


    const zone = await zoneModel.findById(req.params.id).exec();

    const zones = await zoneModel.find().exec();


    for (const iterator of zones) {

        const zoneF = await zoneModel.findById(iterator.id).exec();

        let b = zoneF.subZone.findIndex((value) => {

            const object = Object.fromEntries(value);

            return object.arrive == zone.title;
        });

        if (b > -1) {

            zoneF.subZone.splice(b, 1);

        }

        await zoneF.save();

    }



    const zoneSave = await zone.save();

    const z = zoneModel.findByIdAndDelete(zoneSave.id).exec();

    return res.status(200).json({
        message: 'delete reussi',
        status: 'OK',
        data: z,
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

exports.addSubZone = async (req, res) => {
    try {

        let { arrive, prix } = req.body;

        const zone = await zoneModel.findById(req.params.id).exec();


        zone.subZone.push({
            arrive: arrive,
            prix: prix
        });


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
