const express = require('express');



// import all controllers
const  offreCommandeCtrl =  require('../controllers/offre-special-commande');

const {checkRoleClient} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes

routes.post('/', checkRoleClient() , offreCommandeCtrl.add);
routes.get('/success', offreCommandeCtrl.success);

module.exports = routes;
    