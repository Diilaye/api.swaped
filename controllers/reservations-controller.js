const reservationModel = require('../models/reservation');
const bienModel = require('../models/biens');

const populateObject = [{
    path :'bien',
    populate : [{
        path :'galery'
    }]
},{
    path : 'client'
},{
    path : 'user'
} ,{
    path :'messages'
}];

exports.add = async (req, res) => {

    try {
        
        let {

            bien ,
        
            dateDebut ,
        
            dateFin ,
    
        } =req.body ;
    
        const findBien = await bienModel.findById(bien).exec();

        if (findBien != undefined) {

            const reservation = reservationModel();
    
            reservation.bien = bien ;
            reservation.user = findBien.idParent ;
            reservation.client = req.user.id_user ;
            reservation.dateDebut = dateDebut ;
            reservation.dateFin = dateFin ;
        
            const saveReservation = reservation.save();
        
            return  res.status(201).json({
                message: 'creation réussi',
                status: 'OK',
                data: saveReservation,
                statusCode: 201
            });
        }else {
            return res.status(404).json({
                message: 'erreur supréssion ',
                statusCode: 404,
                data: "error",
                status: 'NOT OK'
            });
        }
    
       

    } catch (error) {

        return res.status(404).json({
            message: 'erreur supréssion ',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
        });

        
    }

    
}

exports.all = async (req,res) => {
    try {
        const reservations = await  reservationModel.find({}).populate(populateObject).exec();
    
    
        return  res.status(200).json({
            message: 'listage réussi',
            status: 'OK',
            data: reservations,
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

exports.allByClient = async (req,res) => {

  
    try {
        const reservations = await  reservationModel.find({
            client : req.user.id_user
        }).populate(populateObject).exec();
    
    
        return  res.status(200).json({
            message: 'listage réussi',
            status: 'OK',
            data: reservations,
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

exports.allByLogement = async (req,res) => {

    try {



        const reservations = await  reservationModel.find({
            user : req.user.id_user
        }).populate(populateObject).exec();
    
    
        return  res.status(200).json({
            message: 'listage réussi',
            status: 'OK',
            data: reservations,
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

exports.update = async (req,res)=> {
    

    try {
        let {

            bien ,
        
            client,
        
            dateDebut ,
        
            dateFin,
        
            status,
        
            userCancel ,
        
            transaction ,
            
        
            motifsCancel ,
    
        } = req.body;
    
        const findReservation = await reservation.findById(req.params.id).populate(populateObject).exec();
    
        if (bien !=undefined) {
            
            const findBien = await bienModel.findById(bien).exec();
            
            if (findBien != undefined) {
                findReservation.bien = bien ;
                findReservation.user = findBien.idParent;
            }else {
                return res.status(404).json({
                    message: 'erreur supréssion ',
                    statusCode: 404,
                    data: "error",
                    status: 'NOT OK'
                });
            }
    
        }
    
        if (client !=undefined) {
            findReservation.client = client ;
        }
    
        if (dateDebut !=undefined) {
            findReservation.dateDebut = dateDebut ;
        }
    
        if (dateFin !=undefined) {
            findReservation.dateFin = dateFin ;
        }
    
        if (status !=undefined) {
            findReservation.status = status ;
        }
    
        if (userCancel !=undefined) {
            findReservation.userCancel = userCancel ;
        }
    
        if (transaction !=undefined) {
            findReservation.transaction = transaction ;
        }
    
        if (motifsCancel !=undefined) {
            findReservation.motifsCancel = motifsCancel ;
        }
    
        const saveReservation = await findReservation.save();
    
        return  res.status(200).json({
            message: 'modification réussi',
            status: 'OK',
            data: saveReservation,
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

exports.updatePartenaire = async (req,res)=> {
   

    try {
         
    let {

        bien ,
    
        client,
    
        dateDebut ,
    
        dateFin,
    
        status,
    
        userCancel ,
    
        transaction ,
        
    
        motifsCancel ,

    } = req.body;

    const findReservation = await reservationModel.findById(req.params.id).populate(populateObject).exec();

    if (bien !=undefined) {
        
        const findBien = await bienModel.findById(bien).exec();
        
        if (findBien != undefined) {
            findReservation.bien = bien ;
            findReservation.user = findBien.idParent;
        }else {
            return res.status(404).json({
                message: 'erreur supréssion ',
                statusCode: 404,
                data: "error",
                status: 'NOT OK'
            });
        }

    }

    if (client !=undefined) {
        findReservation.client = client ;
    }

    if (dateDebut !=undefined) {
        findReservation.dateDebut = dateDebut ;
    }

    if (dateFin !=undefined) {
        findReservation.dateFin = dateFin ;
    }

    if (status !=undefined) {
        findReservation.status = status ;
    }

    if (userCancel !=undefined) {
        findReservation.userCancel = userCancel ;
    }

    if (transaction !=undefined) {
        findReservation.transaction = transaction ;
    }

    if (motifsCancel !=undefined) {
        findReservation.motifsCancel = motifsCancel ;
    }

    const saveReservation = await findReservation.save();

    return  res.status(200).json({
        message: 'modification réussi',
        status: 'OK',
        data: saveReservation,
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

exports.delete = async (req,res) => {

}