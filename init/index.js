const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/wonderLust", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

const initializeData = async () => {
    try {
        await Listing.deleteMany({});
        initData.data.forEach(el => el.owner = '67a756faa9278e6b3134a903');
        await Listing.insertMany(initData.data);
        console.log("Data initialized successfully");
    } catch (error) {
        console.error("Data initialization failed:", error);
    }
};

const init = async () => {
    await connectDB();
    await initializeData();
};

init();