const express = require('express');

const routes = new express.Router();


// import all controllers
const  clientUserCtrl =  require('../controllers/user-client-controller');
const { checkRoleClient, checkRole } = require('../midleweares/auth');


routes.post('/auth',clientUserCtrl.auth);


routes.get('/auth', checkRoleClient() , clientUserCtrl.getAuth);

routes.post('/',clientUserCtrl.store);

routes.get('/', checkRole('admin') ,clientUserCtrl.all);

routes.get('/verif',clientUserCtrl.verifNum);

routes.get(':id/',clientUserCtrl.one);

routes.put('/', checkRoleClient(),clientUserCtrl.update);


module.exports = routes;

