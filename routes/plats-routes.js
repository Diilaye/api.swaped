const express = require('express');



// import all controllers
const  platsCtrl =  require('../controllers/plats-controller');

const {checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes

routes.post('/', checkRole("restaurant") , platsCtrl.add);
routes.put('/:id', checkRole("restaurant") , platsCtrl.update);
routes.get('/byRestaurant', checkRole("restaurant") , platsCtrl.all);
routes.get('/', platsCtrl.all);

module.exports = routes;
    