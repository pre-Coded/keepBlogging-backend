const mongoose = require('mongoose');

const User = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String, 
        required : true,
    },
    profileUrl : {
        type : String, 
    },
    blogs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blogs"
    }], 
    followers : [
        {type: "String"}
    ],
    following : [
        {type: "String",}
    ], 
    likedPosts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]
});

module.exports = mongoose.model("User", User);