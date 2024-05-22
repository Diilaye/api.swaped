const DepenseModel = require('../models/depenses');
const VehiculeModel = require('../models/vehicule');
const LivraisonModel = require('../models/livraison-model');
const { DateTime } = require('luxon');

const objectPopulate = [{
    path: 'mobilite',
    select: 'telephone nom prenom'
}];

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
            message: 'erreur optenue',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }
}

exports.all = async (req, res) => {

    try {

        const depenses = await DepenseModel.find({}).populate(objectPopulate).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: depenses,
            statusCode: 200
        });
    } catch (error) {
        return res.status(404).json({
            message: 'erreur optenue',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }


}


exports.one = async (req, res) => {

    try {

        let {
            id
        } = req.query;

        const depense = await DepenseModel.findById(id).exec();

        return res.status(200).json({
            message: 'liste réussi',
            status: 'OK',
            data: depense,
            statusCode: 200
        });
    } catch (error) {
        return res.status(404).json({
            message: 'erreur optenue',
            status: 'OK',
            data: error,
            statusCode: 404
        });
    }

}


exports.getDepenseOnePeriod = async (req, res) => {


    let { from, to } = req.query;

    const [dayF, monthF, yearF] = from.split('-').map(Number);
    const [dayT, monthT, yearT] = to.split('-').map(Number);

    const fromF = new Date(yearF, monthF - 1, dayF);

    const toD = new Date(yearT, monthT - 1, dayT);


    const vehicules = await VehiculeModel.find({
        notre: 'oui'
    });


    const result = [];


    for (const it of vehicules) {

        const depenses = await DepenseModel.find({
            mobilite: it.idParent
        }).exec();

        const livraisons = await LivraisonModel.find({
            mobilite: it.idParent
        }).exec();



        const dArr = [];
        let sumD = 0;

        const lArr = [];
        let sumL = 0;


        for (const iterator of depenses) {

            const [day, month, year] = iterator.dateCourses.split('-').map(Number);

            let d = new Date(year, month - 1, day);

            if (d >= fromF && d <= toD) {
                dArr.push(iterator);
                sumD = sumD + iterator.prix;
            }


        }


        for (const ite of livraisons) {

            const [day, month, year] = ite.dateCourses.split('-').map(Number);

            let d = new Date(year, month - 1, day);

            if (d >= fromF && d <= toD) {
                lArr.push(ite);
                sumL = sumL + ite.prix_livraison;
            }


        }


        result.push({
            depenses: dArr,
            livraison: lArr,
            motard: {
                nom: it.nom,
                prenom: it.prenom,
                telephone: it.telephone
            },
            charge: sumD,
            chiffreAffaire: sumL,
            revenuNette: sumL - sumD,
            salaire: (sumL - sumD) / 2
        })


    }




    return res.json(result);

}