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
                done(null, false, {message : "Password is incorrect."})
            }
        }

        console.log("user")
        done(null, false, {message : "Username doesn't exist."});
    }catch(e){
        console.log(e);
        done(e, {message : "error"});
    }
}

module.exports = Login