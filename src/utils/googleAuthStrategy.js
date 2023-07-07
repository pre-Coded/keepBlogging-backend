const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK } = require('./constants');
const passport = require('passport')
const User = require("../models/User")
const uuid = require("uuid-random");

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK,
    passReqToCallback: true,
},
    async function (req, accessToken, refreshToken, profile, done) {
        const email = profile.emails[0]["value"];
        console.log(profile);
 
        const user = await User.findOne({ username: email });

        if (user) {
            return done(null, user);
        } else {
            try {
                const user = await User.create({
                    username: email,
                    password: uuid(),
                });
                user.save();
                done(null, user);
            } catch (err) {
                console.log(err);
            }
        }
    }
));