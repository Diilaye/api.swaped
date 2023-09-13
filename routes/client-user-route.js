const express = require('express');

const routes = new express.Router();


// import all controllers
const  clientUserCtrl =  require('../controllers/user-client-controller');
const { checkRoleClient } = require('../midleweares/auth');

routes.post('/auth',clientUserCtrl.auth);


routes.get('/auth', checkRoleClient() , clientUserCtrl.getAuth);

routes.post('/',clientUserCtrl.store);

routes.get('/',clientUserCtrl.all);

routes.get('/verif',clientUserCtrl.verifNum);

routes.get(':id/',clientUserCtrl.one);

routes.put(':id/', checkRoleClient(),clientUserCtrl.update);


module.exports = routes;

