const courseModel = require('../models/courses-model');

exports.storeDeplacemnt = async (req,res ) => {

    try {
        let {
            mobilite,
        
            prix_total,
        
            prix_offre,    
        
            pointDepart ,
        
            pointArrive ,
        
            addresseDepart,
        
            addresseArrive ,
        
            statusLivraison,
        
            statusDate ,
        
            dateCourses 
    
        } = req.body;
    
        const course = courseModel();
    
        course.client = req.user.id_user;
        course.mobilite = mobilite;
        course.prix_total = prix_total;
        course.prix_offre = prix_offre;
        course.pointDepart = pointDepart;
        course.pointArrive = pointArrive;
        course.addresseDepart = addresseDepart;
        course.addresseArrive = addresseArrive;
        course.statusLivraison = statusLivraison;
        course.statusDate = statusDate;
        course.dateCourses = dateCourses;
    
        const courseS =await course.save();
    
        return  res.status(201).json({
            message: 'Creation de courses',
            status: 'OK',
            data:courseS,
            statusCode: 201
        });
    
    
    } catch (error) {
        return res.status(404).json({
            message: 'erreur creation',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.storeLivraison = async (req,res ) => {

    try {
        let {

            client,

            mobilite,
        
            prix_total,
        
            prix_offre,    
        
            pointDepart ,
        
            pointArrive ,
        
            addresseDepart,
        
            addresseArrive ,
    
        } = req.body;
    
        const course = courseModel();
    
        course.client = client;
        course.mobilite = mobilite;
        course.prix_total = prix_total;
        course.prix_offre = prix_offre;
        course.pointDepart = pointDepart;
        course.pointArrive = pointArrive;
        course.addresseDepart = addresseDepart;
        course.addresseArrive = addresseArrive;
        course.statusLivraison = "livraison";
    
        const courseS =await course.save();
    
        return  res.status(201).json({
            message: 'Creation de courses',
            status: 'OK',
            data:courseS,
            statusCode: 201
        });
    
    
    } catch (error) {
        return res.status(404).json({
            message: 'erreur creation',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
    

}


exports.all = async (req,res) => {
    try {

        const courses = await courseModel.find(req.query).exec();

        return  res.status(200).json({
            message: 'liste des courses',
            status: 'OK',
            data:courses,
            statusCode: 200
        });

        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur listage courses',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
}