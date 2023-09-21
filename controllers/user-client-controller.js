const userClientModel = require('../models/user-client');

const bcrytjs = require('bcryptjs');

const salt = bcrytjs.genSaltSync(10);

const jwt = require('jsonwebtoken');

require('dotenv').config({
    path: './.env'
});

exports.store = async (req , res , next) => {

 


    try {
        let {
  
            telephone ,
        
            password ,
        
        } = req.body;
    
    
        const passwordCrypt = bcrytjs.hashSync(password, salt);
    
        const user = userClientModel();
    
        user.password = passwordCrypt;
    
        if(telephone.substr(0,2) =="64" || telephone.substr(0,2) =="66" || telephone.substr(0,2) =="69" || telephone.substr(0,2) =="24" ) {
            
            user.telephoneMOMO = telephone;
    
           
       }else  if(telephone.substr(0,2) =="61" || telephone.substr(0,2) =="62" || telephone.substr(0,2) =="68") {
        
            user.telephoneOM = telephone;
           
       } else{
        return res.status(404).json({
            message: 'Votre opérateur numérique n\’est pas encore pris en compte' ,
            statusCode: 404,
            data: null,
            status: 'NOT OK'
        });
       }
    
        
    
        const token = jwt.sign({
            id_user: user.id,
        }, process.env.JWT_SECRET, { expiresIn: '8784h' });
    
        user.token = token;
        
        
        const userSave = await user.save();
    
        return  res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: userSave,
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

exports.auth = async (req, res) =>{

    try {

        let findUserAdmin = undefined ;

        let{password , telephone } = req.body;

      
        if(telephone.substr(0,2) =="64" || telephone.substr(0,2) =="66" || telephone.substr(0,2) =="69" || telephone.substr(0,2) =="24" ) {

            findUserAdmin = await userClientModel.findOne({
               telephoneMOMO : telephone
           }).exec();

       }else  if(telephone.substr(0,2) =="61" || telephone.substr(0,2) =="62" || telephone.substr(0,2) =="68") {
            findUserAdmin = await userClientModel.findOne({
               telephoneOM : telephone
           }).exec();
       } else{
            findUserAdmin = undefined;
       }
       

        if (findUserAdmin != undefined) {
            if (bcrytjs.compareSync(password, findUserAdmin.password)) {

                const token = jwt.sign({
                    id_user: findUserAdmin.id,
                }, process.env.JWT_SECRET, { expiresIn: '8784h' });

                findUserAdmin.token = token ;

                const saveUserAdmin = await findUserAdmin.save();

                return res.status(200).json({
                    message: 'Connection réussi',
                    status: 'OK',
                    data:saveUserAdmin,
                    statusCode: 200
                });
            }else {
                return res.status(404).json({
                    message: 'Identifiant incorrect',
                    status: 'NOT OK',
                    data: null,
                    statusCode: 404
                });
            }
        }else {
            return res.status(404).json({
                message: 'Identifiant incorrect',
                status: 'NOT OK',
                data: null,
                statusCode: 404
            });
        }

    } catch (error) {
        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.getAuth = async (req , res) => {

    try {
        
        const client = await userClientModel.findById(req.user.id_user).exec();

        return res.status(200).json({
            message: 'Connection réussi',
            status: 'OK',
            data:client,
            statusCode: 200
        });

    } catch (error) {
        return res.status(404).json({
            message: 'Identifiant incorrect',
            status: 'NOT OK',
            data: null,
            statusCode: 404
        });
    }
    


}

exports.update = async (req,res) => {


    let {

        nom ,
    
        prenom ,
    
        telephoneMOMO ,
    
        telephoneOM ,
    
        email ,
    
        photoProfile,
    
        password ,

        oldPassword,

        statusConexion

    } = req.body;

    const findUserAdmin = await userClientModel.findById(req.user.id_user).exec();


    if (nom !=undefined) {
        findUserAdmin.nom = nom ;
    }

    if (prenom !=undefined) {
        findUserAdmin.prenom = prenom ;
    } 
    
    if (telephoneMOMO !=undefined) {
        findUserAdmin.telephoneMOMO = telephoneMOMO ;
    }

    if (telephoneOM !=undefined) {
        findUserAdmin.telephoneOM = telephoneOM ;
    }

    if (email !=undefined) {
        findUserAdmin.email = email ;
    }


    if (password !=undefined) {

        if(bcrytjs.compareSync(oldPassword, findUserAdmin.password)){
            const passwordCrypt = bcrytjs.hashSync(password, salt);
             findUserAdmin.password = passwordCrypt ;
        }else {
            return res.status(404).json({
                message: 'Mot de passe ne sont pas conforme ',
                status: 'NOT OK',
                data: null,
                statusCode: 404
            });
        }

    }

    if (photoProfile !=undefined) {
        findUserAdmin.photoProfile = photoProfile ;
    }

    if (statusConexion !=undefined) {
        findUserAdmin.statusConexion = statusConexion ;
    }

    const saveUserAdmin = await  findUserAdmin.save() ; 

    return res.status(200).json({
        message: 'modification reuissi',
        status: 'OK',
        data: saveUserAdmin,
        statusCode: 200
    })

    try {
       

    } catch (error) {
        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.all = async (req,res) => {

    try {

        const userAdmins = await  userClientModel.find(req.query).exec();

        return res.status(200).json({
            message: 'listes des clients  ',
            status: 'OK',
            data: userAdmins,
            statusCode: 200
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur server',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.one = async (req,res) => {

    try {

        const userAdmins = await  userClientModel.findById(req.params.id).exec();

        return res.status(200).json({
            message: 'listes des clients  ',
            status: 'OK',
            data: userAdmins,
            statusCode: 200
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur server',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }

}

exports.verifNum = async (req,res) => {
    
    try {

        let findUserAdmin = undefined ;

        let NumeroNoEXISTANT = 1;

    let {telephone} = req.query ;



        if(telephone.substr(0,2) =="64" || telephone.substr(0,2) =="66" || telephone.substr(0,2) =="69" || telephone.substr(0,2) =="24" ) {

             findUserAdmin = await userClientModel.findOne({
                telephoneMOMO : telephone
            }).exec();
            NumeroNoEXISTANT = 2;

        }else  if(telephone.substr(0,2) =="61" || telephone.substr(0,2) =="62" || telephone.substr(0,2) =="68") {
             findUserAdmin = await userClientModel.findOne({
                telephoneOM : telephone
            }).exec();
            NumeroNoEXISTANT = 3;
        } else{
             findUserAdmin = undefined;
        }

       

        if (findUserAdmin != undefined) {
            
               
            return res.status(200).json({
                message: 'numero dans la base réussi',
                status: 'OK',
                data:findUserAdmin,
                statusCode: 200
            });
        }else {
            if (NumeroNoEXISTANT != 1) {
                return res.status(201).json({
                    message: 'Pas existant',
                    status: 'OK',
                    data:"numero valid ",
                    statusCode: 201
                });
            }
            return res.status(404).json({
                message: 'Votre opérateur téléphonique n\’est pas encore pris en compte',
                status: 'NOT OK',
                data: null,
                statusCode: 404
            });
        }

    } catch (error) {
        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
}