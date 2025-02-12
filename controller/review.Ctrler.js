const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
module.exports.addReviewRoute = async (req, res) => {
    const listing = await Listing.findById(req.params._id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("suc", "Reviews added");
    res.redirect(`/listing/${listing._id}`);

}
module.exports.destroyReviewRoute = async (req, res) => {
    let { _id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(_id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("suc", "Reviews Deleted");
    res.redirect(`/listing/${_id}`);
};