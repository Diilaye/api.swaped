const vehiculeCtrl = require('../controllers/vehicule-controller');


const express = require('express');
const { checkRole } = require('../midleweares/auth');

const router = express.Router();

router.get('/' , vehiculeCtrl.all);

router.get('/me' , checkRole('mobilite'), vehiculeCtrl.me);

router.put('/position' , checkRole('mobilite') ,vehiculeCtrl.position);

router.get('/start' , checkRole('mobilite') ,vehiculeCtrl.onOrOff);
router.get('/testTache' ,vehiculeCtrl.testTaches);

module.exports = router ;