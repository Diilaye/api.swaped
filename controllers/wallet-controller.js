const walletModel = require('../models/wallet');
exports.add = async (req,res ) => {

  try {
    
    let {

        userId,
        typeWallet,

    } = req.body ;


    const wallet = walletModel();

    wallet.userId = req.user.id_user ;

    wallet.typeWallet = typeWallet ;

    const walletSave = await wallet.save();

    return res.status(201).json({
        message: 'Creation reussi',
        status: 'OK',
        data: walletSave,
        statusCode: 201
    });

  } catch (error) {
    return res.status(404).json({
        message: 'erreur serveur',
        status: 'NOT OK',
        data: error,
        statusCode: 404
    });
  }

}

exports.one = async (req,res) => {

    try {
      const find = await walletModel.findOne({
        userId : req.user.id_user
      });
  
      return res.status(200).json({
        message: 'Creation reussi',
        status: 'OK',
        data: find,
        statusCode: 200
    });
    } catch (error) {
      return res.status(404).json({
        message: 'erreur serveur',
        status: 'NOT OK',
        data: error,
        statusCode: 404
    });
    }

}