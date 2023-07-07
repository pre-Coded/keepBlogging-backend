const User = require("../models/User");

const UpdateUser = async (req, res) => {
    try {
        const followerUpdate = req.query.followerUpdate;
        const profileUrlUpdate = req.query.profileUrlUpdate;

        if (followerUpdate) {
            const { username, followerName } = req.body;

            const result = await User.findOne( {username : followerName} );

            if (result.followers.includes(username)) {

                const data = await User.findOneAndUpdate( { username : followerName}, {
                    $pull: { followers: username },
                }, { new: true })
                await data.save();

                const data2 = await User.findOneAndUpdate({ username : username}, {
                    $pull: { following: followerName }
                }, { new: true });

                return res.status(200).json({
                    message: "follower pulled successfully",
                    data1: data,
                    data2: data2,
                });

            } else {

                const data = await User.findOneAndUpdate({username : followerName}, {
                    $push: { followers: username },
                }, { new: true })
                await data.save();

                const data2 = await User.findOneAndUpdate({ username : username}, {
                    $push: { following: followerName }
                }, { new: true });

                return res.status(200).json(200, {
                    message: "follower added successfully",
                    data1: data,
                    data2: data2,
                });
            }
        }else if(profileUrlUpdate){

        }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = UpdateUser;