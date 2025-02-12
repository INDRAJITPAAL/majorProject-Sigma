const express = require("express");
const router = (express.Router());


const { saveRedirectUrl } = require("../utils/authentication.middlewear.js");
const { wrapAsync } = require("../utils/wrapAsync.tryCatchHandler.js");
const {
    signupRenderFormRoute,
    signupPostRoute,
    loginFormRenderRoute,
    loginPostRoute,
    passportAuthenticate,
    logoutRoute,

} = require("../controller/userAuth.Ctrler.js");
//signup route
router.route("/signup").get(signupRenderFormRoute).post(wrapAsync(signupPostRoute));
//login route
router.route("/login").get(loginFormRenderRoute).post(saveRedirectUrl, passportAuthenticate, loginPostRoute);
//logout route
router.get("/logout", logoutRoute);

module.exports = router;