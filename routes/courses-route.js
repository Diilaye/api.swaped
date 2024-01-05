const express = require('express');

const router = express.Router();

const courseCtrl = require("../controllers/courses-controller");
const { checkRoleClient , checkRole } = require('../midleweares/auth');

router.post('/', checkRoleClient()  ,courseCtrl.storeDeplacemnt );

router.post('/livraison', checkRole('restaurant')  ,courseCtrl.storeLivraison );

router.put('/cancel-client' , checkRoleClient() , courseCtrl.anulerClient);

router.get('/' ,courseCtrl.all );


module.exports = router ;