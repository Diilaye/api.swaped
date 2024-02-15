const express = require('express');



// import all controllers
const  platsCtrl =  require('../controllers/plats-controller');

const {checkRole , checkRoleClient} = require('../midleweares/auth');

const reclamationCtrl = require("../controllers/reclamations-controller");

const routes = new express.Router();

// Add routes

routes.get('/', reclamationCtrl.all);
routes.get('/vehicules', reclamationCtrl.getVehiculeProxy);

module.exports = routes;
    