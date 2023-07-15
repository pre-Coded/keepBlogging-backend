const express = require('express');
const passport = require('passport');
const BlogList = require('../controllers/BlogList.Controller');
const CreateBlogs = require('../controllers/CreateBlogs.Controller');
const personalBlog = require('../controllers/PersonalBlogs.Controller');
const SignUp = require('../controllers/SignUp.Controller');
const SendImg = require('../controllers/SendImg.Controller');
const multer = require('multer');
const fs = require('fs');
const UserController = require('../controllers/User.Controller');
const UpdateUser = require('../controllers/UpdateUserController');

require('dotenv').config();

const apiPublic = express.Router();
const apiProtected = express.Router();

const ensureAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.json({
            authStatus: false,
        })
    }
}

apiPublic.post('/signup', SignUp);

require('../utils/googleAuthStrategy');
apiPublic.get('/google', passport.authenticate('google', { scope : ['profile' , 'email'] }));
apiPublic.get('/google/callback', passport.authenticate('google', { failureRedirect: `/login`}), (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
});

require('../utils/localStrategy');
apiPublic.post('/login', passport.authenticate("local"),
    (req, res) => {

        if (req.isAuthenticated() && req.user) {
            res.json({
                authStatus: true, 
                data: {
                    id: req.user._id,
                    username: req.user.username
                }
            })
        } else {
            res.json({
                message: "authentication failed",
            })
        }
    })
// protected apis
apiProtected.use(ensureAuthentication);
apiProtected.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, PATCH, OPTIONS"
    );
    return res.json({
        authStatus: true,
        data: {
            id: req.user._id,
            username: req.user.username,
            followers: req.user.followers,
            following: req.user.following,
            likedPosts: req.user.likedPosts,
        }
    })
})

apiProtected.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
    })

    req.logout(req.user, () => { });
    res.clearCookie("connect.sid");
    res.json({
        status: 200,
        message: "logged OUt",
        authStatus: false,
    })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const directory = `./uploads`;
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }

        return cb(null, directory)
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({
    storage: storage,
})

apiProtected.post("/createBlog", upload.single("blogThumbnail"), CreateBlogs);
apiProtected.get("/personalBlog", personalBlog);

apiProtected.get("/blogList", BlogList);
apiProtected.post("/blogList/:likesAndComments", BlogList);
apiProtected.get("/user/", UserController)
apiProtected.put("/user", UpdateUser);
apiProtected.get("/image/:filename", SendImg);

module.exports = {
    apiPublic,
    apiProtected
}
