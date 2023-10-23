const express = require('express');

const routes = new express.Router();


// import all controllers
const  restaurantCtrl =  require('../controllers/restaurant-controller');
const { checkRoleClient, checkRole } = require('../midleweares/auth');

routes.get('/all',restaurantCtrl.all);

routes.get('/', checkRole('restaurant') ,restaurantCtrl.one);
routes.put('/', checkRole('restaurant') ,restaurantCtrl.update);




module.exports = routes;

