const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const Mongo_store = require('connect-mongo');
const passport = require('passport');
const {apiPublic, apiProtected} = require('./src/router/api')
const cookieParser = require('cookie-parser')

require('dotenv').config();
const app = express();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser : true }).then(()=>{
    console.log("db connected.")
}).catch((e) => {
    console.log("failure in connection to db");
})

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use( cors(function (req, cb) {
    let corsOptions;
    corsOptions = {

      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      credentials: true,

    };

    cb(null, corsOptions);
  }), function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(session({
    name : "Prince", 
    secret : "aldjfkajfkad",
    resave : false,
    saveUninitialized : false, 
    
    store : Mongo_store.create({
        mongoUrl : process.env.DB_CONNECT, 
        autoRemove : 'disabled',
    }, (err) => {
        console.log("connected to mongo-connect", err);
    }), 
    cookie : {
        maxAge : 1000*60*60*24, 
        domain: 'https://timely-youtiao-3188ff.netlify.app'
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiPublic);
app.use("/api", apiProtected);

const port = process.env.PORT || 3010

app.listen( port , ()=>{
    console.log(`Server running on port ${port}`); 
}) 