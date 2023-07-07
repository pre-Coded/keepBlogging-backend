const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    userId : {
        type : String, 
        required : true
    },
    username :{
        type : String, 
        required : true,
    },
    thumbnail : {
        type : String,
    },
    title : {
        type : String, 
        required : true,
        default : "Random"
    }, 
    shortDesc : {
        type : String,
        required: true,
    },
    desc : {
        type : String, 
        required : true,
    },
    tags : [
        {
            type : String,
            default : "All"
        }
    ], 
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    createdAt : {
        type : Date, 
        default : Date.now
    }
})

module.exports = mongoose.model("Blogs", blogSchema);