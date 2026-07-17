const User = require("../models/user.js");


module.exports.rendersignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to StayNest!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginInForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginIn = async (req, res) => {
    req.flash("success", "Welcome back to StayNest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut= (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
};