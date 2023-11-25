const express = require('express');



// import all controllers
const  offreCommandeCtrl =  require('../controllers/offre-special-commande');

const {checkRoleClient, checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes

routes.post('/', checkRoleClient() , offreCommandeCtrl.add);
routes.get('/',  offreCommandeCtrl.all);
routes.get('/client', checkRoleClient() , offreCommandeCtrl.allByClient);
routes.get('/restaurant', checkRole('restaurant') , offreCommandeCtrl.allByRestaurant);
routes.get('/success', offreCommandeCtrl.success);

module.exports = routes;
    