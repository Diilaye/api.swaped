const express = require('express');

const routes = new express.Router();

const { checkRole } = require('../midleweares/auth');


// import all controllers
const decaissementCtrl = require('../controllers/decaissement');

routes.post('/', checkRole("admin"), decaissementCtrl.add);
routes.get('/', decaissementCtrl.all);
routes.get('/:id', decaissementCtrl.one);
routes.put('/:id', checkRole("admin"), decaissementCtrl.update);
routes.delete('/:id', checkRole("admin"), decaissementCtrl.delete);


module.exports = routes;