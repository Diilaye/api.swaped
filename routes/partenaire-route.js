const express = require('express');

const routes = new express.Router();

const {checkRole} = require('../midleweares/auth');


// import all controllers
const  partenaireCtrl =  require('../controllers/partenaire-controller');

routes.post('/',partenaireCtrl.add);
routes.get('/',partenaireCtrl.all);
routes.get(':id/',partenaireCtrl.one);
routes.put(':id/',partenaireCtrl.update);
routes.delete('/:id', checkRole('admin')  ,partenaireCtrl.suspendre);


module.exports = routes;
