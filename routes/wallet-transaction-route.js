
const express = require('express');



// import all controllers
const  walletCtrl =  require('../controllers/wallet-transaction-contraller');

const { checkRoleClient, checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.post('/' , walletCtrl.add);
routes.get('/', checkRoleClient() , walletCtrl.all);
routes.get('/ByUser', checkRoleClient() , walletCtrl.allByUser);
routes.get('/success',walletCtrl.success);
routes.get('/failled',walletCtrl.failed);

module.exports = routes;
    