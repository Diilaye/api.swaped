const reclamationModel = require('../models/reclamations');


const vehiculeModel = require('../models/vehicule');

const utiilsFnc = require('../utils/getLgLat');


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

exports.closeRecamation = async (req , res) => {

    try {

        let {
            probleme ,
            solution
        }=req.body;
    
        const reclamation = await reclamationModel.findById(req.params.id).exec();
    
        reclamation.probleme=probleme ;
    
        reclamation.solution = solution;
    
       const  reclamationSave = await reclamation.save();

       return  res.status(200).json({
            message: 'update  reclamation',
            status: 'OK',
            data: reclamationSave,
            statusCode: 200
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

exports.getVehiculeProxy = async (req,res) => {

    try {
        
        let {arrive , pays} = req.query ;

    if(pays == undefined) {
        pays = 'gn';
    }

    const point = await utiilsFnc.getLgLatFunc(arrive,pays);

    const vehicules = await vehiculeModel.find().exec();
    
    let vehiculeTab = [];

    let vehiculeResult = [];

    let vehiculeResultAffiche = [];


    for (const iterator of vehicules) {

        const result = {};

        if(iterator.typeVehicule == 'moto'){

            result["info"] = await  utiilsFnc.getDistance(point,Object.fromEntries(iterator.localisation) );

            result["vehicule"] = iterator ;
    
            vehiculeTab.push(result);
           
        }
        

    }

    vehiculeTab.sort((a, b) => a.info['distance']['value'] - b.info['distance']['value']);

    vehiculeResult = vehiculeTab.slice(0,5);

    return res.status(200).json({
        message: 'distance évaluer ',
        status: 'OK',
        data: vehiculeResult,
        statusCode: 200
    });

    } catch (error) {
        return res.status(404).json({
            message: 'erreur serveur ',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
          });
    }
    

}