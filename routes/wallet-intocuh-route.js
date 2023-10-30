
const express = require('express');



// import all controllers
const  walletCtrl =  require('../controllers/wallet-intouch-controller');

const { checkRoleClient, checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.post('/', checkRoleClient() , walletCtrl.add);
routes.get('/', checkRoleClient() , walletCtrl.one);
routes.post('/success', walletCtrl.success);

module.exports = routes;
    