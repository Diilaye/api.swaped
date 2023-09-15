const express = require('express');

const routes = new express.Router();


// import all controllers
const  adminUserCtrl =  require('../controllers/admin-user-controller');
const { checkRoleClient } = require('../midleweares/auth');

routes.post('/auth',adminUserCtrl.auth);

routes.get('/auth', checkRoleClient() ,adminUserCtrl.getAuth);

routes.post('/',adminUserCtrl.store);

routes.get('/',adminUserCtrl.all);

routes.get(':id/',adminUserCtrl.one);

routes.put('/' ,checkRoleClient(),adminUserCtrl.update);


module.exports = routes;

