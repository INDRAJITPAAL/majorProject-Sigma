const passport = require("passport");
const User = require("../models/user.localPassportMongooseSchema");
module.exports.signupRenderFormRoute = (req, res) => {
    res.render("../views/listings/signUp.page.ejs");
}
module.exports.signupPostRoute = async (req, res, next) => {
    let { username, email, password } = req.body;
    let newUser = new User({
        email: email,
        username: username,
    })
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("suc", "Welcome to wonderlust");
        res.redirect("/listing");
    })
}
module.exports.loginFormRenderRoute = (req, res) => {
    res.render("../views/listings/login.page.ejs");
}

module.exports.loginPostRoute = async (req, res) => {
    req.flash("suc", "Welcome back to Wonderlust!");
    res.redirect(res.locals.redirectUrl || "/listing");
}
module.exports.passportAuthenticate = passport.authenticate("local", { failureRedirect: '/login', failureFlash: { type: 'er', message: 'Invalid username or password.' } });

module.exports.logoutRoute = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("suc", "you are logedout!");
        res.redirect("/listing");
    })
}