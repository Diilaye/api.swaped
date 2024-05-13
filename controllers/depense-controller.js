const DepenseModel = require('../models/depenses');
const { DateTime } = require('luxon');


exports.add = async (req, res) => {
    try {
        let {



            prix,


            title

        } = req.body;

        const depense = DepenseModel();

        depense.mobilite = req.user.id_user;
        depense.title = title;
        depense.prix = prix;

        depense.dateCourses = DateTime.now().toFormat('dd-MM-yyyy');

        const depenseSave = await depense.save();

        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: depenseSave,
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