

const express = require('express');


// import all controllers
const assuranceCtrl = require("../controllers/assurance");




const routes = new express.Router();

// Add routes
routes.get('/', assuranceCtrl.all);

routes.post('/', assuranceCtrl.add);

module.exports = routes;