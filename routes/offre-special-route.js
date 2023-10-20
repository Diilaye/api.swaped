const express = require('express');



// import all controllers
const  offreCtrl =  require('../controllers/offre-special-controller');

const {checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes

routes.post('/', checkRole("restaurant") , offreCtrl.add);
routes.get('/byRestaurant',  checkRole("restaurant"), offreCtrl.allByRestaurant);
routes.get('/', offreCtrl.all);

module.exports = routes;
    