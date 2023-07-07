const Blogs = require("../models/Blogs")
const fs = require('fs').promises

const BlogList = async (req, res) => {
    try {
        const { likesAndComments } = req.params;

        console.log(likesAndComments);

        if (likesAndComments === "likes") {
            const { userId, blogId } = req.body;

            const result = await Blogs.findById(blogId)
            console.log(result.likes);

            if (result) {

                if (result.likes.includes(userId)) {

                    const data = await Blogs.findByIdAndUpdate(blogId, {
                        $pull: { likes: userId },
                    }, { new: true })
                    await data.save();

                    return res.json({
                        message: "blog unliked successfully",
                        data: data,
                    });

                } else {

                    const data = await Blogs.findByIdAndUpdate(blogId, {
                        $push: { likes: userId },
                    }, { new: true })
                    await data.save();

                    return res.json(200, {
                        message: "blog liked successfully",
                        data: data,
                    });
                }
            }

        } else {
            const result = await Blogs.find({}).sort({ createdAt: -1 });

            if (result) {

                const data = await Promise.all(result.map(async (blog) => {
                    const filename = blog.thumbnail;
                    const imagePath = `./uploads/${filename}`;
                
                    try {
                      const buffer = await fs.readFile(imagePath);
                      const base64Image = buffer.toString('base64');
                
                      return {
                        blogData: blog,
                        imgData: base64Image,
                      };
                    } catch (error) {
                      console.error('Error reading file:', error);
                      return null;
                    }
                  }));

                const filteredData = data.filter((item) => item !== null);

                res.contentType('application/json');
                return res.json(200, {
                    message: "BlogList fetched Succesfully",
                    data: filteredData,
                })

            }
        }


    } catch (e) {
        return res.json({
            message: "Error in fetching data"
        })
    }
}

module.exports = BlogList