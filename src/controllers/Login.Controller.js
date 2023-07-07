const User = require('../models/User');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

const Login = async (username, password, done) => {
    try{

        const isUser = await User.findOne({username : username});

        if(isUser){
            const isVerified = bcrypt.compareSync(password, isUser.password)

            if(isVerified){
                return done(null, isUser);
            }else{
                console.log("pass")
                return done(null, false)
            }
        }

        console.log("user")
        return done(null, false);
    }catch(e){
        console.log(e);
        return done(e);
    }
}

module.exports = Login