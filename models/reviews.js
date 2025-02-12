const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const reviewSchema = Schema({

    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    }
    ,
    created_at: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

});

module.exports = mongoose.model("Review", reviewSchema);