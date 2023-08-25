const filesModel = require('../models/file');
const { base64 } = require('../utils/base64');

exports.store = async (req, res ,next ) => {

    try {

    const file =  filesModel();
    
    const F = await  base64(req.body.image);

    console.log(F);

    if ((F =='File to large')) {
        return res.status(404).json({
            message: 'Fichier trop volumineux ',
            status: 'OK',
            data: "",
            statusCode: 404
        })
    } else {
        console.log(F['url']);

        file.url  = F['url'];
    
        file.type  = F['type'];
        
        // file.user = req.user.id;
    
        const saveFile = await  file.save();
    
        return res.json({
            message: 'Fichier crée avec succes',
            status: 'OK',
            data: saveFile,
            statusCode: 201
        })
    }

  
    } catch (error) {
        res.json({
            message: 'Erreur creation',
            status: 'OK',
            data: error,
            statusCode: 400
        })
    }
    
}



exports.all = async (req  , res ,next ) => {
    
    try {
        const files = await filesModel.find(req.query).exec(); 
        res.json({
            message: 'Fichiers trouvée avec succes',
            status: 'OK',
            data: files,
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: 'Fichier non trouvée',
            status: 'OK',
            data: err,
            statusCode: 400
        })
    }
}

exports.one = async (req  , res ,next ) => {
    try {
        const file = await filesModel.findById(req.params.id).exec(); 
        res.json({
            message: 'Fichier trouvée avec succes',
            status: 'OK',
            data: file,
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: 'Fichier non trouvée',
            status: 'OK',
            data: err,
            statusCode: 400
        })
    }
}

exports.update = async  (req  , res ,next ) => {

    const file = await filesModel.findById(req.params.id).exec();

    res.json(file);
}

exports.delete = (req  , res ,next ) => filesModel.findByIdAndDelete(req.params.id).then(result => {
    res.json({
        message: 'supréssion réussi',
        status: 'OK',
        data: null,
        statusCode: 200
    });
}).catch( err => res.json({
    message: 'erreur supréssion ',
    statusCode: 404,
    data: err,
    status: 'NOT OK'
}));