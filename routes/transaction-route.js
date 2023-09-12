const express = require('express');



// import all controllers
const  transactionCtrl =  require('../controllers/transaction-controller');

const { checkRoleClient, checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.post('/', checkRoleClient() , transactionCtrl.add);
routes.get('/success',transactionCtrl.success);
routes.get('/failled',transactionCtrl.failed);

module.exports = routes;
    