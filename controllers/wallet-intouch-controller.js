const walletModel = require('../models/wallet-intouch');
const { DateTime } = require('luxon');

exports.add = async (req,res ) => {

  try {

    let {

      typeWallet,

    } = req.body ;


    const wallet = walletModel();

    wallet.userId = req.user.id_user ;

    wallet.idWallet = DateTime.now().ts;

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


exports.success = async (req,res) => {
  console.log("req.params");
  console.log(req.params);
  console.log("req.query");
  console.log(req.query);
  console.log("req.body");
  console.log(req.body);
}
