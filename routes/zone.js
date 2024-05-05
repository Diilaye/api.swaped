const express = require('express');

const routes = new express.Router();

const { checkRole } = require('../midleweares/auth');


// import all controllers
const zoneCtrl = require('../controllers/zone');

routes.post('/', checkRole("admin"), zoneCtrl.add);
routes.get('/', zoneCtrl.all);
routes.get('/:id', zoneCtrl.one);
routes.put('/:id', checkRole("admin"), zoneCtrl.update);
routes.delete('/:id', checkRole("admin"), zoneCtrl.delete);


module.exports = routes;