const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const express = require('express');
const morgan = require('morgan'); 
const helmet = require('helmet');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const middlewares = require('./middlewares');
const mongoose = require('mongoose');
//const apiRouter = require('./api');

const logs = require('./api/logs');
const user = require('./api/user');
const auth = require('./api/auth');

const app = express();
//console.log(process.env.DATABASE_URL);
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
});
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));
app.use(function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
    next();
  });

// making a change to commit
// http://localhost:3000
// https://dazzling-hodgkin-b03184.netlify.app
app.use(express.json());

app.get('/', (req, res) =>{
    res.json({
        message: 'Hello World!'
    });
});
app.use(express.urlencoded({ extended: true }));

app.use('/api/logs', logs);
app.use('/api/user', user);
app.use('/api/auth', auth);

app.use(middlewares.notFound);

// eslint-disable-next-line no-unused-vars
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);

});
