const express = require('express');



// import all controllers
const  reservationCtrl =  require('../controllers/restaurant-controller');

const { checkRoleClient} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.get('/',reservationCtrl.all);
routes.post('/', checkRoleClient() , reservationCtrl.add);

module.exports = routes;
    