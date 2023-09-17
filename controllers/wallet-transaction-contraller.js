const walletTransactionModel = require('../models/wallet-transactions');

exports.add = async (req,res) => {

    try {
        let  {
       
        amount,

        
        typeService,
    
        means,

    } =req.body;

    const walletTransaction = walletTransactionModel();

    const find = await walletModel.findOne({
        userId : req.user.id_user
    });

    walletTransaction.amount = amount ;

    walletTransaction.userWallet = find.id ;

    walletTransaction.typeService = typeService ;

    walletTransaction.means = means ;

    const saveWalletTransaction = await  walletTransaction.save();

    return res.status(201).json({
        message: 'Creation reussi',
        status: 'OK',
        data: saveWalletTransaction,
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

exports.all = async (req,res) => {
    
    try {
        const find = await  walletTransactionModel.find(req.query).exec();

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

exports.allByUser = async (req,res) => {
    try {

        const find = await  walletTransactionModel.find({
            userWallet : req.user.id_user
        }).exec();

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