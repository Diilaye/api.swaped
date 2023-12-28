const express = require('express');

const router = express.Router();

const courseCtrl = require("../controllers/courses-controller");

router.post('/',  courseCtrl.all );


module.exports = router ;