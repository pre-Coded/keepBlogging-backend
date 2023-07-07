const User = require("../models/User");

const UserController = async (req, res) => {
    try {
        const userInfo = req.query.userInfo;
        const result = await User.findOne({ username: userInfo }).select("-password").populate("blogs");
        return res.status(200).json({
            message: "Userinfo fetched Successfully",
            data: result,
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = UserController;