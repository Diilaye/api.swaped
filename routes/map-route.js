const express = require('express');



// import all controllers
const  mapCtrl =  require('../controllers/map-controller');




const routes = new express.Router();

// Add routes
routes.get('/places',mapCtrl.place);
routes.get('/getLgLat', mapCtrl.getLatLong);
routes.get('/name', mapCtrl.address);
routes.get('/distance', mapCtrl.distanceCourse);
routes.get('/livraison', mapCtrl.livraison);
routes.get('/livraison-depart', mapCtrl.livraisonDepart);
routes.get('/livraison-depart-course', mapCtrl.livraisonDepartCourse);

routes.get('/zone-livraison', mapCtrl.zone);

module.exports = routes;
    