const { ListingSchema, reviewSchema } = require("../schema.joi.js");
const ExpressError = require("./ExpressError.errorHandler.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { wrapAsync } = require("../utils/wrapAsync.tryCatchHandler.js");

//login verification
module.exports.isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("er", "You must be login!")
        return res.redirect("/login");
    } else {
        return next();
    }
}


//redirect url
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();

}

//joi validation

module.exports.listingValidate = (req, res, next) => {
    let error = ListingSchema.validate(req.body).error;
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
}

//joi validation
module.exports.reviewValidate = (req, res, next) => {
    let error = reviewSchema.validate(req.body).error;
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
}

module.exports.isAuth = wrapAsync(async (req, res, next) => {
    let { _id } = req.params;
    const listingData = await Listing.findById(_id);
    if (!res.locals.currUser._id.equals(listingData.owner._id)) {
        req.flash("er", "you are not owner of this listing");
        return res.redirect(`/listing/${_id}`);
    }
    return next();
})

module.exports.isReviewAuthor = async (req, res, next) => {
    let { _id, reviewId } = req.params;
    const reviewData = await Review.findById(reviewId);
    if (!reviewData.author._id.equals(req.user._id)) {
        req.flash("er", "you are not owner of this review");
        return res.redirect(`/listing/${_id}`);
    }
    return next();
}