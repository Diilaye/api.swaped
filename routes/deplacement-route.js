const express = require('express');

const deplacementCtrl = require('../controllers/deplacement-controller');
const { checkRoleClient } = require('../midleweares/auth');

const routes = express.Router();


routes.post('/' , checkRoleClient() , deplacementCtrl.store);



module.exports = routes;