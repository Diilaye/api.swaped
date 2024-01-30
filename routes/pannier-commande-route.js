const express = require('express');

const router = express.Router();

const pannierCtrl = require('../controllers/pannier-commande');
const { checkRoleClient, checkRole } = require('../midleweares/auth');

router.get('/client' , checkRoleClient() ,pannierCtrl.allByClient );
router.get('/' , checkRole('admin') ,pannierCtrl.all );
router.get('/restaurant' , checkRole('restaurant') ,pannierCtrl.allByRestaurant );
router.post('/' ,  checkRoleClient() , pannierCtrl.add);
router.post('/table' ,  checkRoleClient() , pannierCtrl.addTable);
router.put('/:id' ,  checkRoleClient() , pannierCtrl.updateStatusLivraison);
router.post('/success' , pannierCtrl.success);




module.exports = router;