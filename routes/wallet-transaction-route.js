
const express = require('express');



// import all controllers
const  walletCtrl =  require('../controllers/wallet-transaction-contraller');

const { checkRoleClient, checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.post('/', checkRoleClient() , walletCtrl.add);
routes.get('/', checkRoleClient() , walletCtrl.all);
routes.get('/ByUser', checkRoleClient() , walletCtrl.allByUser);

module.exports = routes;
    