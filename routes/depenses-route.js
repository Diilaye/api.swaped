const express = require('express');

const routes = new express.Router();

const { checkRole } = require('../midleweares/auth');


// import all controllers
const depenseCtrl = require('../controllers/depense-controller');

routes.post('/', checkRole("mobilite"), depenseCtrl.add);


module.exports = routes;