const express = require('express');



// import all controllers
const  bienCtrl =  require('../controllers/biens-controller');

const {checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.get('/',bienCtrl.all);
routes.get('/:id', bienCtrl.one);
routes.post('/', checkRole('logement') , bienCtrl.add);
routes.delete('/:id', bienCtrl.delete);

module.exports = routes;
    