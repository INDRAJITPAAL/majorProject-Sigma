const express = require("express");
const router = express.Router({ mergeParams: true });
const { wrapAsync } = require("../utils/wrapAsync.tryCatchHandler.js");
const { reviewValidate, isLogin, isReviewAuthor } = require("../utils/authentication.middlewear.js");
const {
    addReviewRoute,
    destroyReviewRoute,
} = require("../controller/review.Ctrler.js");

//add review
router.post("/reviews", isLogin, reviewValidate, wrapAsync(addReviewRoute));

// delete review 
router.delete("/review/:reviewId", isLogin, isReviewAuthor, wrapAsync(destroyReviewRoute));

module.exports = router;