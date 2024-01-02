const courseModel = require('../models/courses-model');

const vehiculeModel = require('../models/vehicule');

const utiilsFnc = require('../utils/getLgLat');


const objectPopulate = [{
    path : 'client',
    select : 'telephone nom prenom'
},{
    path : 'mobilite'
}];



exports.storeDeplacemnt = async (req,res ) => {

    


    try {
        
        let {
        
            prix_total,
        
            prix_offre,    
        
            pointDepart ,
        
            pointArrive ,
        
            addresseDepart,
        
            addresseArrive ,
        
            statusLivraison,
        
            statusDate ,
        
            dateCourses ,
    
            statusLivraisonVehicule
    
        } = req.body;
    
        const course = await courseModel();
    
        course.client = req.user.id_user;
        course.prix_total = prix_total;
        course.prix_offre = prix_offre;
        course.pointDepart = pointDepart;
        course.pointArrive = pointArrive;
        course.addresseDepart = addresseDepart;
        course.addresseArrive = addresseArrive;
        course.statusLivraison = statusLivraison;
        course.statusDate = statusDate;
        course.dateCourses = dateCourses;
        course.statusLivraisonVehicule = statusLivraisonVehicule;
    
        const courseS =await course.save();
    
        const vehicules = await vehiculeModel.find().exec();
    
        let vehiculeTab = [];
    
        let vehiculeResult = [];
    
        let vehiculeResultAffiche = [];
    
    
        for (const iterator of vehicules) {
    
            const result = {};
    
            if(iterator.online == "on" && iterator.typeVehicule == courseS.statusLivraisonVehicule ){
    
                result["info"] = await  utiilsFnc.getDistance(Object.fromEntries(courseS.pointDepart),Object.fromEntries(iterator.localisation) );
    
                result["vehicule"] = iterator ;
        
                vehiculeTab.push(result);
               
                vehiculeTab.sort((a, b) => a.info['distance']['value'] - b.info['distance']['value']);
    
                vehiculeResult = vehiculeTab.slice(0 , 5);
    
                for (const it of vehiculeResult) {
    
                    const vhFind = await vehiculeModel.findById(it.vehicule.id).exec();
    
                    vhFind.coursesActif.push(courseS.id);
    
                   
    
                    const VHS = await vhFind.save();
    
                    vehiculeResultAffiche.push(VHS);
                }
    
            }
            
    
        }
    
    
        let task ;
    
        let a = 0;
    
        task =  setInterval(()=> {
    
            a++;
    
    
            if(a==4) {
    
                clearInterval(task);
            
            }
    
    
        } , 60 * 1000);
    
      
        return  res.status(201).json({
            message: 'Creation de courses',
            status: 'OK',
            data:{
                "course" :courseS,
                "liste-vehicule" :vehiculeResultAffiche 
            },
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
        course.statusLivraisonVehicule = "moto";
    
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

        const courses = await courseModel.find(req.query).populate(objectPopulate).exec();

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