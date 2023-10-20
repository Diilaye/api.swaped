const express = require('express');



// import all controllers
const  menuSpecialCtrl =  require('../controllers/special-menu');

const {checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes

routes.post('/', checkRole("restaurant") , menuSpecialCtrl.add);
routes.get('/', menuSpecialCtrl.all);
routes.get('/byRestaurant',  checkRole("restaurant") ,  menuSpecialCtrl.allRestaurant);

module.exports = routes;
    