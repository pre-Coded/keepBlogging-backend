const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const Mongo_store = require('connect-mongo');
const passport = require('passport');
const {apiPublic, apiProtected} = require('./src/router/api')
const  { DB_CONNECT, CLIENT_URL }  = require('./src/utils/constants');
require('dotenv').config();



const app = express();

mongoose.connect(DB_CONNECT, { useNewUrlParser : true }).then(()=>{
    console.log("db connected.")
}).catch((e) => {
    console.log("failure in connection to db");
})

app.use(express.json());
app.use(cors({credentials: true, origin: `${CLIENT_URL}`}));
app.use(express.urlencoded({extended : true}));


app.use(session({
    secret : "aldjfkajfkad",
    resave : false,
    saveUninitialized : false, 
    store : Mongo_store.create({
        mongoUrl : DB_CONNECT, 
        autoRemove : 'disabled',
    }, (err) => {
        console.log("connected to mongo-connect", err);
    }), 
    cookie : {
        maxAge : 1000*60*60*24, 
        secure : false, 
        sameSite : false,
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiPublic);

app.use("/api", apiProtected);

app.listen(3010, ()=>{
    console.log("Running on port 3010");
})