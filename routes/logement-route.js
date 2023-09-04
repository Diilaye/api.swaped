const express = require('express');

const routes = new express.Router();

const {checkRole} = require('../midleweares/auth');


// import all controllers
const  logementCtrl =  require('../controllers/logement-controller');

routes.post('/',logementCtrl.add);
routes.get('/',logementCtrl.all);
routes.get('/:id',logementCtrl.one);


module.exports = routes;
