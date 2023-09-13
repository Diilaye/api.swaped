const express = require('express');

const routes = new express.Router();


// import all controllers
const  adminUserCtrl =  require('../controllers/admin-user-controller');

routes.post('/auth',adminUserCtrl.auth);

routes.post('/',adminUserCtrl.store);

routes.get('/',adminUserCtrl.all);

routes.get(':id/',adminUserCtrl.one);

routes.put('/',adminUserCtrl.update);


module.exports = routes;

