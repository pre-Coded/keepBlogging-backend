const Blogs = require("../models/Blogs");
const User = require("../models/User");
const path = require('path');

const CreateBlogs = async ( req, res) => {
    try{
        const { userId, username , title, shortDesc , desc, tags } = req.body;
        console.log(req.file);
        
        const result = await Blogs.create({
            userId : userId, 
            username : username,
            thumbnail : req.file.filename,
            title : title, 
            shortDesc : shortDesc,
            desc : desc,
            tags : tags,
        })

        if(result){
            const user = await User.findOneAndUpdate({ _id : userId }, {
                $push : {
                    blogs : result
                },
            });

            return res.json({
                message : "Blog posted Successfully", 
                data : result,
            })
        }
    }catch(e){
        console.log(e);
        return res.json(
            {
                message : "error in uploading post"
            }
        )
    }
}

module.exports = CreateBlogs