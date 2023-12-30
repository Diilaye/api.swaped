const vehiculeCtrl = require('../controllers/vehicule-controller');


const express = require('express');

const router = express.Router();

router.get('/' , vehiculeCtrl.all);

module.exports = router ;