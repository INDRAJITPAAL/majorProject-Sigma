const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.errorHandler.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_tokens = process.env.MAP_TOKENS_PUBLIC;
const geoCodingClient = mbxGeocoding({ accessToken: map_tokens });


module.exports.indexRoute = async (req, res) => {
    let allData = await Listing.find({});
    res.render("listings/index.ejs", { datas: allData });
}

module.exports.addNewFormRoute = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
    let { _id } = req.params;
    let allData = await Listing.findById(_id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    if (!allData) {
        req.flash("er", "Requesting does not existing!");
        res.redirect("/listing");
    }
    let map_key = process.env.MAP_TOKENS_PUBLIC;
    res.render("listings/show.ejs", { datas: allData, mp: map_key });
}

module.exports.editRoute = async (req, res) => {
    let { _id } = req.params;
    let allData = await Listing.findById(_id);
    if (!allData) {
        req.flash("er", "Requesting does not existing!");
        res.redirect("/listing");
    }
    let img = allData.image.url.replace("/upload", "/upload/h_100,w_200");
    res.render("listings/edit.ejs", { datas: allData, img });
}

module.exports.newPostRoute = async (req, res, next) => {
    const response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    let newListing = new Listing(req.body.listing);
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;
    newListing.geometry = (response.body.features[0].geometry);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("suc", "Listing is created");
    res.redirect("/listing");
}

module.exports.editPutRoute = async (req, res, next) => {
    let { _id } = req.params;
    if (req.file) {
        let { path, filename } = req.file;
        req.body.listing.image = { filename, url: path };
    }

    const response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    if (!req.body.listing) {
        return new ExpressError(404, "send valid data for listing");
    }
    req.body.listing.geometry = (response.body.features[0].geometry);
    await Listing.findByIdAndUpdate(_id, req.body.listing);
    req.flash("suc", "Listing is Updated");
    res.redirect(`/listing/${_id}`);
}

module.exports.listingDestroyRoute = async (req, res) => {
    let { _id } = req.params;
    await Listing.findByIdAndDelete(_id);
    req.flash("suc", "Listing is Deleted");
    res.redirect("/listing");
}