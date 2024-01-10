const vehiculeModel = require('../models/vehicule');
const courseModel = require('../models/courses-model');

const objectPopulate = [{
    path : 'walletDriver'
},{
    path :'coursesActif',
    populate : [{
        path : 'client',
        select : 'telephone nom prenom'
    },{
        path : 'mobilite'
    }]
    
},{
    path :'courseSelected',
    populate : [{
        path : 'client',
        select : 'telephone nom prenom'
    },{
        path : 'mobilite'
    }] 
},,{
    path :'courses',
    populate : [{
        path : 'client',
        select : 'telephone nom prenom'
    },{
        path : 'mobilite'
    }] 
}];

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
        }).populate(objectPopulate).exec();

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

exports.acceptCourses = async (req,res)=> {

    try {
        let {idCourse}  =req.body ;

        const course = await courseModel.findById(idCourse).exec();

        if(course.mobilite == null ) {

            const vehicule = await vehiculeModel.findOne({
                idParent : req.user.id_user
            }).exec();
        
            const vehicules = await vehiculeModel.find().exec();
        
            course.mobilite = vehicule.id;
        
            const courseSave = await course.save();
        
        
        
        
            vehicule.courseSelected = courseSave.id;

            vehicule.online = "off";

            vehicule.courses.push(courseSave.id);

            vehicule.coursesActif = [];

            const vehiculeS = await vehicule.save();
        
            for (const iterator of vehicules) {
                
                if(iterator.coursesActif.includes(courseSave.id)) {
                    const vh =await vehiculeModel.findById(iterator.id).exec();

                    vh.coursesActif.remove(courseSave.id);

                    const v =await vh.save();
                }

            }

            return res.status(200).json({
                message : "acceptation courses",
                status : 200,
                data : courseSave,
                statusCode : 'OK'
            });
        }
        return res.status(404).json({
            message : "error data",
            status : 404,
            data : "cette courses est deja accepte",
            statusCode : 'NOT OK'
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