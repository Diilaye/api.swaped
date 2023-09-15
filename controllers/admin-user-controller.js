const userAdminModel = require('../models/admin');

const bcrytjs = require('bcryptjs');

const salt = bcrytjs.genSaltSync(10);

const jwt = require('jsonwebtoken');

require('dotenv').config({
    path: './.env'
});

exports.store = async (req , res , next) => {

    try {
        let {
            service,
    
            nom ,
        
            prenom,
        
            telephoneOM,

            telephoneMOMO,
    
            email,
        
            identifiant ,
        
            password ,
        
        } = req.body;

        if(service =="admin") {
             return res.status(404).json({
                message: 'erreur serveur ',
                statusCode: 404,
                data: "Vous pouvez pas enregister un admin",
                status: 'NOT OK'
            });
        }
    
    
        const passwordCrypt = bcrytjs.hashSync(password, salt);
    
        const user = userAdminModel();
    
        user.service = service;
    
        user.nom = nom;
    
        user.prenom = prenom;
    
        user.telephoneOM = telephoneOM;

        user.telephoneMOMO = telephoneMOMO;
    
        user.password = passwordCrypt;
    
        user.email = email;
    
        user.identifiant = identifiant;
    
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

        let{password , identifiant} = req.body;

        const findUserAdmin = await userAdminModel.findOne({
            identifiant : identifiant
        }).exec();

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
            service,
    
            nom ,
        
            prenom,
        
            telephoneOM,

            telephoneMOMO,
    
            email,
        
            password ,
    
            oldPassword,
    
            photoProfile,
    
            statusConexion,

            conditionAnulation,
        
    
        } = req.body;
    
        const findUserAdmin = await userAdminModel.findById(req.user.id_user).exec();
    
        if (service !=undefined) {
            findUserAdmin.service = service ;
        }
    
        if (nom !=undefined) {
            findUserAdmin.nom = nom ;
        }
    
        if (prenom !=undefined) {
            findUserAdmin.prenom = prenom ;
        } 
        
        if (telephoneOM !=undefined) {
            findUserAdmin.telephoneOM = telephoneOM ;
        }

        if (telephoneMOMO !=undefined) {
            findUserAdmin.telephoneMOMO = telephoneMOMO ;
        }
    
        if (email !=undefined) {
            findUserAdmin.email = email ;
        }

        if (conditionAnulation !=undefined) {
            findUserAdmin.conditionAnulation = conditionAnulation ;
        }
    
        if (password !=undefined) {
    
            if(bcrytjs.compareSync(oldPassword, findUserAdmin.password)){
                 findUserAdmin.password = password ;
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
            message: 'Mot de passe ne sont pas conforme ',
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

exports.getAuth = async (req, res) => {
    try {

        const userAdmins = await  userAdminModel.findById(req.user.id_user).exec();

        return res.status(200).json({
            message: 'Mot de passe ne sont pas conforme ',
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
            message: 'Mot de passe ne sont pas conforme ',
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