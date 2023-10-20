const userClientModel = require('../models/user-client');

const bcrytjs = require('bcryptjs');

const axios = require('axios');

const codePhoneModel = require('../models/code-phone');


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

        user.telephone = telephone;
    
    
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

        let{password , telephone } = req.body;

      
        const findUserAdmin = await userClientModel.findOne({
            telephone : telephone
        }).exec();
       

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


    

    try {
        let {

            nom ,
        
            prenom ,
        
            telephone ,
        
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
        
        if (telephone !=undefined) {
            findUserAdmin.telephone = telephone ;
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

        let {telephone} = req.query ;


    const min = 10000;
    const max = 99999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    

        console.log(telephone);

    const findUserAdmin = await userClientModel.findOne({
            telephone : telephone
        }).exec();
console.log(findUserAdmin);
   
        if (findUserAdmin != undefined) {

            
            
               
            return res.status(200).json({
                message: 'numero dans la base réussi',
                status: 'OK',
                data:findUserAdmin,
                statusCode: 200
            });

        } else {

            console.log(telephone.trim().substring(0,3));
           
            if(telephone.trim().substring(0,3)== "224") {

                const newCode = codePhoneModel();

                newCode.code = code;
                newCode.phone = "+"+telephone.trim();
        
                const s = await newCode.save();
        
                console.log('s => ', code);
                
        
                const updateCode = async () => {
        
                    const i = await codePhoneModel.findById(s._id);
        
                    i.is_treat = true;
        
                    const j = await i.save();
                }
        
                setTimeout(updateCode, 300000);

                let data = JSON.stringify({
                    "outboundSMSMessageRequest": {
                        "address": "tel:+"+telephone.trim(),
                        "senderAddress": "tel:+224626501651",
                        "senderName": "Deally",
                        "outboundSMSTextMessage": {
                        "message": "Votre code de validation Swaped est le suivant : "+code
                        }
                    }
                    });
                
                    let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+224626501651/requests',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': 'Bearer '+req.accessToken
                    },
                    data : data
                    };
                
                    axios.request(config)
                    .then((response) => {
                    console.log(JSON.stringify(response.data));
                    return res.status(202).json({
                        message: 'Pas existant',
                        status: 'OK',
                        data:"Code envoyé  ",
                        statusCode: 202
                    });
                    })
                    .catch((error) => {
                    console.log(error);
                    });
            }else {
                return res.status(201).json({
                    message: 'Pas existant',
                    status: 'OK',
                    data:"numero valid ",
                    statusCode: 201
                });
            }
               
           
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

exports.verifCode = async (req,res) => {
    const codes = await codePhoneModel.findOne({
        code : req.body.code,
        phone : req.body.phone,
        is_treat : false
    }) ;

    console.log();

    if(codes){
        codes.is_treat = true ;
        await codes.save();
        return res.status(200).json({
            message: 'code valid et verifier',
            status: 'OK',
            data: null,
            statusCode: 200
        })
    }

    return res.status(404).json({
        message: 'code non disponible ',
            status: 'OK',
            data: null,
            statusCode: 404
    })
}