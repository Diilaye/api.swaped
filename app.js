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