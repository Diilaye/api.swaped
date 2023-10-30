const express = require('express');



// import all controllers
const  reservationCtrl =  require('../controllers/reservation-restaurant-controller');
const { checkRoleClient } = require('../midleweares/auth');




const routes = new express.Router();

// Add routes
routes.get('/byRestaurant', checkRoleClient() ,reservationCtrl.byRestaurant);
routes.get('/byClient', checkRoleClient() , reservationCtrl.byClient);
routes.put('/:id', checkRoleClient() , reservationCtrl.update);
routes.post('/',checkRoleClient() ,reservationCtrl.add);

module.exports = routes;
    