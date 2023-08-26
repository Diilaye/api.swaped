const express = require('express');

const routes = new express.Router();


// import all controllers
const  partenaireCtrl =  require('../controllers/partenaire-controller');

routes.post('/',partenaireCtrl.add);



module.exports = routes;
