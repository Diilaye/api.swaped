const express = require('express');

const routes = new express.Router();


// import all controllers
const  partenaireCtrl =  require('../controllers/partenaire-controller');

routes.post('/',partenaireCtrl.add);
routes.get('/',partenaireCtrl.all);
routes.get(':id/',partenaireCtrl.one);
routes.put(':id/',partenaireCtrl.update);


module.exports = routes;
