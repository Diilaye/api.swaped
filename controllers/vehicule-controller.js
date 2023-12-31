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

exports.me = async (req,res )=> {
    try {
        const vehicules = await vehiculeModel.findOne({
            idParent : req.user.id_user
        });

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


exports.position = async (req, res ) => {

    

    try {
        let {lat ,lng} = req.query ;
        const vehicule = await vehiculeModel.findOne({
            idParent : req.user.id_user
        });
    
    
        vehicule.localisation = {
                lat: parseFloat(lat),
                lng:parseFloat(lng)
            };
    
    
            const vehiculeS = await vehicule.save();
    
            return res.json({
                message : "update posistion",
                status : 200,
                data : vehiculeS,
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

exports.onOrOff = async (req ,res) => {


    try {

        const vehicule = await vehiculeModel.findOne({
            idParent : req.user.id_user
        });

        if(vehicule.online =='on') {
            vehicule.online = 'off';
        }else {
            vehicule.online = 'on';
        }
    
        const vehiculeS = await vehicule.save();
    
            return res.json({
                message : "update posistion",
                status : 200,
                data : vehiculeS,
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

exports.testTaches = async (req,res) => {

    let task ;

    let a = 0;

    task =   setInterval(()=> {
        console.log("before ",a);
        a++;
        if(a== 5) {
            clearInterval(task);
          }
      } , 60 * 1000);

     
     
res.json('ici');
}