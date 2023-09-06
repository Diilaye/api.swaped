const express = require('express');

const routes = new express.Router();


// import all controllers
const  clientUserCtrl =  require('../controllers/user-client-controller');

routes.post('/auth',clientUserCtrl.auth);

routes.post('/',clientUserCtrl.store);

routes.get('/',clientUserCtrl.all);

routes.get(':id/',clientUserCtrl.one);

routes.put(':id/',clientUserCtrl.update);


module.exports = routes;

