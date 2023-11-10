const express = require('express');



// import all controllers
const  transactionCtrl =  require('../controllers/transaction-controller');

const { checkRoleClient, checkRole} = require('../midleweares/auth');

const authOrange = require('../midleweares/auth-orange');



const routes = new express.Router();

// Add routes
routes.post('/',checkRoleClient() , transactionCtrl.add);
routes.get('/success',transactionCtrl.success);
routes.post('/success-intouch',transactionCtrl.successIntouch);
routes.get('/cashin' , transactionCtrl.cashinSn);
routes.get('/getBalance' , transactionCtrl.getBalance);

routes.get('/failled',transactionCtrl.failed);

module.exports = routes;
    