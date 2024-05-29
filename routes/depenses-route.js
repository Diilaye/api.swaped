const express = require('express');

const routes = new express.Router();

const { checkRole } = require('../midleweares/auth');


// import all controllers
const depenseCtrl = require('../controllers/depense-controller');

routes.post('/', checkRole("mobilite"), depenseCtrl.add);
routes.get('/', checkRole("admin"), depenseCtrl.getDepenseOnePeriod);
routes.get('/by-user', checkRole("mobilite"), depenseCtrl.allDepenseByUser);


module.exports = routes;