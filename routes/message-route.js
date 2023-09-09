const express = require('express');

const routes = new express.Router();


// import all controllers
const  messageCtrl =  require('../controllers/message-controler');


routes.post('/',messageCtrl.add);

routes.get('/',messageCtrl.all);

routes.get(':id/',messageCtrl.one);

routes.put(':id/',messageCtrl.update);

routes.delete(':id/',messageCtrl.delete);


module.exports = routes;

