const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const db = require('./config/db');

const app = express();

const path = require('path');

const fileRoute  = require('./routes/file-route');

const mapRoute  = require('./routes/map-route');

const partenairesRoute  = require('./routes/partenaire-route');


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