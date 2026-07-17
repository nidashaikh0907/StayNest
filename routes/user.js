const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.rendersignUpForm)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLoginInForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.loginIn
    );


router.get("/logout", userController.logOut);
module.exports = router;