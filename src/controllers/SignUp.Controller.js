const User = require('../models/User')
const bcrypt = require('bcrypt');

const SignUp = async (req, res) =>{
    try{
        const {username, password} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.findOne({username : username});

        if(user){
            return res.json({
                status : 202, 
                message : "User already exists",
                data : null,
            })
        }
        
        const result = await User.create({
            username : username, 
            password : hashPassword
        })

        return res.json({
            status : 200, 
            message : "User created Successfully", 
            data : result,
        })

    }catch(e){
        return res.json({
            status : 404, 
            message : "Failed",
        });
    }
}

module.exports = SignUp