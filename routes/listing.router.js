const express = require("express");
const router = express.Router();

const { wrapAsync } = require("../utils/wrapAsync.tryCatchHandler.js");
const { isLogin, listingValidate, isAuth } = require("../utils/authentication.middlewear.js");
const { upload } = require("../config.cloudinary.js");
const {
    indexRoute,
    addNewFormRoute,
    showRoute,
    editRoute,
    newPostRoute,
    editPutRoute,
    listingDestroyRoute,
} = require("../controller/listig.Ctrler.js");

//indexRoute
router.get("/", wrapAsync(indexRoute));
//add new route
router.route("/_new").get(isLogin, addNewFormRoute).post(isLogin, listingValidate, upload.single("listing[image][url]"), wrapAsync(newPostRoute));

//show route
router.get("/:_id", wrapAsync(showRoute));
//edit route
router.route("/:_id/edit").get(isLogin, isAuth, wrapAsync(editRoute)).put(upload.single("listing[image][url]"),isAuth, wrapAsync(editPutRoute));
   
//delete route
router.delete("/:_id/delete", isLogin, isAuth, wrapAsync(listingDestroyRoute));

module.exports = router;