const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const db = require('./config/db');

const app = express();

const path = require('path');

const fileRoute  = require('./routes/file-route');

const mapRoute  = require('./routes/map-route');

const partenairesRoute  = require('./routes/partenaire-route');

const adminUserRoute  = require('./routes/admin-user-route');

const logementRoute  = require('./routes/logement-route');

const biensRoute = require('./routes/biens-routes');

const adresseRoute = require('./routes/adresse-route');

const clientRoute = require('./routes/client-user-route');

const reservationRoute = require('./routes/reservation-route');

const messageRoute = require('./routes/message-route');

const transactionRoute = require('./routes/transaction-route');

const walletRoute = require('./routes/wallet-route');

const walletTransactionRoute = require('./routes/wallet-transaction-route');

const restaurantRoute = require('./routes/restaurant-route');

const platsRoute = require('./routes/plats-routes');

const offreSpecialRoute = require('./routes/offre-special-route');

const offreSpecialCommandeRoute = require('./routes/offre-special-commande-routes');

const reservationRestaurant = require('./routes/reservation-restaurant-route');

const pannierRoute = require('./routes/pannier-route');

const pannierCommandeRoute = require('./routes/pannier-commande-route');

const deplacementRoute = require('./routes/deplacement-route');

const coursesRouter = require('./routes/courses-route');

const vehiculeRoute = require('./routes/vehicule-route');

const reclamationRoute = require('./routes/reclamations-routes');


const  paypal = require('paypal-rest-sdk');


require('dotenv').config({
    path: './.env'
});

app.use(cors());

app.use(bodyParser.json({
    limit: '10000mb'
}));

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10000mb'
}));


paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
  });

app.use('/swaped-file', express.static('uploads'));



app.use('/v1/api/files' ,fileRoute);

app.use('/v1/api/maps' ,mapRoute);

app.use('/v1/api/partenaires' ,partenairesRoute);

app.use('/v1/api/admin-user' ,adminUserRoute);

app.use('/v1/api/logements' ,logementRoute);

app.use('/v1/api/biens' ,biensRoute);

app.use('/v1/api/adresses' ,adresseRoute);

app.use('/v1/api/clients' ,clientRoute);

app.use('/v1/api/reservations' ,reservationRoute);

app.use('/v1/api/messages' ,messageRoute);

app.use('/v1/api/transactions' ,transactionRoute);

app.use('/v1/api/wallets' ,walletRoute);

app.use('/v1/api/wallet-transactions' ,walletTransactionRoute);

app.use('/v1/api/restaurants' ,restaurantRoute);

app.use('/v1/api/plats' ,platsRoute);

app.use('/v1/api/special-offres' ,offreSpecialRoute);

app.use('/v1/api/special-offres-commandes' ,offreSpecialCommandeRoute);

app.use('/v1/api/reservations-restaurant' ,reservationRestaurant);

app.use('/v1/api/pannier' ,pannierRoute);

app.use('/v1/api/pannier-commande' ,pannierCommandeRoute);

app.use('/v1/api/deplacements' ,deplacementRoute);

app.use('/v1/api/courses' ,coursesRouter);

app.use('/v1/api/vehicules' ,vehiculeRoute);

app.use('/v1/api/reclamations' ,reclamationRoute);



app.get('/', (req,res) => {
    res.send('ici la terre');
})

db().then(_ => {
    const port = process.env.PORT
    app.listen(port, () => {
        console.log(process.env.MONGO_RUI);
        console.log(`Server started on ${port}`);
    });
});