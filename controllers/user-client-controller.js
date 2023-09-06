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
    
            nom ,
        
            prenom ,
        
            telephoneMOMO ,
        
            telephoneOM ,
        
            email ,
        
            password ,
        
            photoProfile,
        
        } = req.body;

    
    
        const passwordCrypt = bcrytjs.hashSync(password, salt);
    
        const user = userClientModel();
    
        user.service = service;
    
        user.nom = nom;
    
        user.prenom = prenom;
    
        user.password = passwordCrypt;
    
        user.email = email;
    
        user.telephoneMOMO = telephoneMOMO;

        user.telephoneOM = telephoneOM;

        user.photoProfile = photoProfile;
        
    
        const token = jwt.sign({
            id_user: user.id,
            service_user : user.service , 
            identifiant_user : user.identifiant
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

        let{password , telephoneMOMO ,telephoneOM} = req.body;

        if(telephoneMOMO !=undefined) {
             findUserAdmin = await userClientModel.findOne({
                telephoneMOMO : telephoneMOMO
            }).exec();
        }else  if(telephoneOM !=undefined) {
             findUserAdmin = await userClientModel.findOne({
                telephoneOM : telephoneOM
            }).exec();
        } else{
             findUserAdmin = undefined;
        }

       

        if (findUserAdmin != undefined) {
            if (bcrytjs.compareSync(password, findUserAdmin.password)) {

                const token = jwt.sign({
                    id_user: findUserAdmin.id,
                    service_user : findUserAdmin.service , 
                    identifiant_user : findUserAdmin.identifiant
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

exports.update = async (req,res) => {

    try {
        
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
    
        const findUserAdmin = await userAdminModel.findById(req.params.id).exec();
    
    
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
    
        if (identifiant !=undefined) {
            findUserAdmin.identifiant = identifiant ;
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
    
        const saveUserAdmin = findUserAdmin.save() ; 
    
        return res.status(200).json({
            message: 'modification reuissi',
            status: 'OK',
            data: saveUserAdmin,
            statusCode: 200
        })

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

        const userAdmins = await  userAdminModel.find(req.query).exec();

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

        const userAdmins = await  userAdminModel.findById(req.params.id).exec();

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