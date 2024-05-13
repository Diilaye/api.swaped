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

        const livraison = LivraisonModel();

        livraison.clientPhone = clientPhone;
        livraison.mobilite = req.user.id_user;
        livraison.prix_livraison = prix_livraison;
        livraison.prix_repas = prix_repas;
        livraison.addresseDepart = addresseDepart;
        livraison.addresseArrive = addresseArrive;
        livraison.dateCourses = DateTime.now().toFormat('dd-MM-yyyy');

        const livraisonSave = await livraison.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: livraisonSave,
            statusCode: 201
        });
    } catch (error) {
        return res.status(404).json({
            message: 'creation réussi',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }
}