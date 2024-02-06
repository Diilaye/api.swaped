const express = require('express');

const router = express.Router();

const courseCtrl = require("../controllers/courses-controller");
const { checkRoleClient , checkRole } = require('../midleweares/auth');
const smsOrangeToken = require('../midleweares/sms-orange'); 


router.post('/', smsOrangeToken,checkRoleClient()  ,courseCtrl.storeDeplacemnt );

router.post('/paiement', checkRoleClient()  ,courseCtrl.addtransaction );

router.post('/paiement-wallet', checkRoleClient()  ,courseCtrl.addTransactionWallet );

router.post('/livraison',smsOrangeToken, checkRole('restaurant')  ,courseCtrl.storeLivraison );

router.put('/cancel-client' , checkRoleClient() , courseCtrl.anulerClient);

router.put('/fin-course' , checkRoleClient() , courseCtrl.fincourse);

router.get('/:id' , checkRoleClient() , courseCtrl.one);

router.put('/:id' , checkRole("mobilite") , courseCtrl.updateStatus);

// router.get('/' ,courseCtrl.all );


module.exports = router ;