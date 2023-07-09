const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const Login = require('../controllers/Login.Controller');
const User = require('../models/User');

passport.use(
    new localStrategy({
        usernameField : 'username', 
        passwordField : 'password',
    }, 
    Login
    )
)

passport.serializeUser((user, done) => {
    console.log(user);
    return done(null, user._id);
})

passport.deserializeUser(async (userId, done) => {
    console.log("deser");
    await User.findById(userId).then((user)=>{
        return done(null,user);
    }).catch((err) => {
        return done(err);
    })
})



