const messageModel = require('../models/message');
const reservationModel = require('../models/reservation');

exports.add = async (req,res , next) => {

   try {
    
    let {
        reservation,
        text
    } = req.body ;

    const message = messageModel();

    message.text = text ;
    message.reservation = reservation;
    message.statusSender = statusSender;

    const saveMessage = await message.save();

    const findReservation = reservationModel.findById(reservation).exec();

    findReservation.messages.push(saveMessage.id);

    await findReservation.save();

    return  res.status(201).json({
        message: 'modification réussi',
        status: 'OK',
        data: saveMessage,
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

exports.all = async (req, res ) => {

   try {

        const messages = await messageModel.find(req.query).exec();
    
        return  res.status(200).json({
            message: 'modification réussi',
            status: 'OK',
            data: saveMessage,
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

exports.one = async (req,res) => {
    try {

        const messages = await messageModel.findById(req.params.id).exec();
    
        return  res.status(200).json({
            message: 'modification réussi',
            status: 'OK',
            data: saveMessage,
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

exports.update = async (req,res) => {
    try {
        
        let {
            text
        } = req.body ;
    
        const message = await messageModel.findById(req.params.id).exec();
    
        message.text = text ; 
    
        const saveMessage = await message.save();
    
        return  res.status(200).json({
            message: 'modification réussi',
            status: 'OK',
            data: saveMessage,
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

   try {
    
    const message = await messageModel.findByIdAndDelete(req.params.id).exec();

    return  res.status(200).json({
        message: 'modification réussi',
        status: 'OK',
        data: saveMessage,
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