const LivraisonModel = require('../models/livraison-model');
const { DateTime } = require('luxon');


exports.add = async (req, res) => {



    try {

        let {
            clientPhone,

            prix_livraison,

            prix_repas,


            addresseDepart,

            addresseArrive,

        } = req.body;

        const livraisons = await LivraisonModel.find({
            clientPhone: clientPhone,
            dateCourses: DateTime.now().toFormat('dd-MM-yyyy'),
            mobilite: req.user.id_user,

        }).exec();

        let io = 0;

        for (const iterator of livraisons) {
            console.log("iterator");
            console.log(iterator.dateCourses.split('-').reverse());
            const inputTime = new Date(iterator.dateCourses.split('-').reverse().join('-') + "T" + iterator.heuresCourses + ":00Z");
            console.log("inputTime");
            console.log(inputTime);
            const now = new Date();
            // Calcul de la différence en millisecondes
            const diffMs = now - inputTime;

            // Convertir la différence en minutes
            const diffMinutes = diffMs / (1000 * 60);

            console.log(diffMinutes);

            if (diffMinutes < 5) {
                io = 1;
                console.log("diffMinutes < 5)");
            }
        }
        console.log(io);
        console.log("io");

        if (io == 0) {
            const livraison = LivraisonModel();

            livraison.clientPhone = clientPhone;
            livraison.mobilite = req.user.id_user;
            livraison.prix_livraison = prix_livraison;
            livraison.prix_repas = prix_repas;
            livraison.addresseDepart = addresseDepart;
            livraison.addresseArrive = addresseArrive;
            livraison.dateCourses = DateTime.now().toFormat('dd-MM-yyyy');
            livraison.heuresCourses = DateTime.now().toFormat('HH:mm');

            const livraisonSave = await livraison.save();

            return res.status(201).json({
                message: 'creation réussi',
                status: 'OK',
                data: livraisonSave,
                statusCode: 201
            });
        } else {
            return res.status(403).json({
                message: 'erreur de creation  veuillez attendre au moins 5 minutes',
                status: 'OK',
                data: {},
                statusCode: 403
            });
        }


    } catch (error) {
        return res.status(404).json({
            message: 'creation réussi',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }
}

exports.validCourse = async (req, res) => {

    try {

        let {
            clientPhone,

        } = req.body;

        const livraisons = await LivraisonModel.find({
            clientPhone: clientPhone,
            dateCourses: DateTime.now().toFormat('dd-MM-yyyy'),
            mobilite: req.user.id_user,

        }).exec();

        let io = 0;

        for (const iterator of livraisons) {
            console.log("iterator");
            console.log(iterator.dateCourses.split('-').reverse());
            const inputTime = new Date(iterator.dateCourses.split('-').reverse().join('-') + "T" + iterator.heuresCourses + ":00Z");
            console.log("inputTime");
            console.log(inputTime);
            const now = new Date();
            // Calcul de la différence en millisecondes
            const diffMs = now - inputTime;

            // Convertir la différence en minutes
            const diffMinutes = diffMs / (1000 * 60);

            console.log(diffMinutes);

            if (diffMinutes < 5) {
                io = 1;
                console.log("diffMinutes < 5)");
            }
        }

        if (io == 0) {


            return res.status(201).json({
                message: 'creation réussi',
                status: 'OK',
                data: "livraisonSave",
                statusCode: 201
            });
        } else {
            return res.status(403).json({
                message: 'erreur de creation  veuillez attendre au moins 5 minutes',
                status: 'OK',
                data: {},
                statusCode: 403
            });
        }

    } catch (error) {
        return res.status(404).json({
            message: 'creation réussi',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }

}