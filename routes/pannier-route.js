const express = require('express');

const router = new express.Router();

const pannierRoute = require('../controllers/pannier-controller');

const {checkRoleClient} = require('../midleweares/auth');

router.post('/' , checkRoleClient() , pannierRoute.add);

router.get('/', checkRoleClient() , pannierRoute.byClient);

router.put('/:id' , checkRoleClient() , pannierRoute.deleteComplement);

router.delete('/:id' , checkRoleClient() , pannierRoute.delete);

module.exports = router ;