const assuranceModel = require("../models/assurance");



exports.add = async (req, res, next) => {



    try {

        let {
            code,
            phone
        } = req.body;

        const assurance = assuranceModel();

        message.code = code;
        message.phone = phone;

        const saveAssurance = await assurance.save();


        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: saveAssurance,
            statusCode: 201
        });

    } catch (error) {
        return res.status(404).json({
            message: 'erreur supréssion ',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
        });
    }

}
