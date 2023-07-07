const User = require("../models/User");

const personalBlog = async (req, res) => {
  try {
    const userId = req.query.userId;

    const result = await User.findById(userId).select("-password").populate({
        path: "blogs",
        options: { sort: { createdAt: -1 } } // Sort by 'createdAt' field in descending order
      });


    if (result) {
      return res.json({
        message: "Personal Blog successfully fetched",
        data: result,
      });
      
    } else {
      return res.json({
        message: "No blogs created",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error fetching personal blog:", error);
    return res.status(500).json({ error: "An error occurred while fetching personal blog" });
  }
};

module.exports = personalBlog;
