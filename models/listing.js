const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Review = require("./reviews");
const reviews = require("./reviews");

let listingSchema = new Schema({
    title: {
        type: String,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            set: (v) => v === ""
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmLLJntH0MB_nQ1Sy1IhNvY-JX8KZCaOoAyg&s"
                : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});


listingSchema.post("findOneAndDelete", async (listingData) => {
    if (listingData) {
        await Review.deleteMany({ _id: { $in: listingData.reviews } })
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;