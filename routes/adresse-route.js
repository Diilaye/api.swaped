const express = require('express');



// import all controllers
const  adresseCtrl =  require('../controllers/adresse-controller');

const {checkRoleClient} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.get('/',  checkRoleClient() ,adresseCtrl.all);

routes.get('/:id', adresseCtrl.one);

routes.post('/', checkRoleClient() , adresseCtrl.add);

routes.put('/:id', checkRoleClient() , adresseCtrl.update);


routes.delete('/:id', adresseCtrl.delete);

module.exports = routes;
    