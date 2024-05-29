const express = require('express');

const routes = new express.Router();

const { checkRole } = require('../midleweares/auth');


// import all controllers
const livraisonCtrl = require('../controllers/livraison-controller');

routes.post('/', checkRole("mobilite"), livraisonCtrl.add);
routes.post('/verif', checkRole("mobilite"), livraisonCtrl.validCourse);


module.exports = routes;