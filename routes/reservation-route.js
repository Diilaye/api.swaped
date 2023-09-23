const express = require('express');



// import all controllers
const  reservationCtrl =  require('../controllers/reservations-controller');

const { checkRoleClient, checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.get('/',reservationCtrl.all);
routes.get('/client', checkRoleClient() , reservationCtrl.allByClient);
routes.get('/logement', checkRole('logement') , reservationCtrl.allByLogement);
routes.post('/', checkRoleClient() , reservationCtrl.add);
routes.post('/prospect', checkRole('logement') , reservationCtrl.addProspect);
routes.put('/partenaires/:id', checkRole('logement') , reservationCtrl.updatePartenaire);
routes.put('/:id', checkRoleClient() , reservationCtrl.update);

module.exports = routes;
    