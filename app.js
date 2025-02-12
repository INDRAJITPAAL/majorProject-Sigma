if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const ExpressError = require("./utils/ExpressError.errorHandler.js");
const listingRoute = require("./routes/listing.router.js");
const reviewRoute = require("./routes/review.router.js");
const userRoute = require("./routes/user.router.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.localPassportMongooseSchema.js");

const DbURL = process.env.ATLAS_DB;

const store = MongoStore.create({
    mongoUrl: DbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds
})

const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));
app.engine("ejs", ejsMate);

// let MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust";

main().then(() => {
    console.log("success! with wonderLust");
}).catch((e) => {
    console.log(e);
})
async function main() {
    await mongoose.connect(DbURL);
}

app.use((req, res, next) => {
    res.locals.msg = req.flash("suc");
    res.locals.err = req.flash("er");
    res.locals.currUser = req.user;
    next();
});




//home route
app.get("/", (req, res) => {
    res.send("Hi i am in root");
});

//listing route
app.use("/listing", listingRoute);

// Reviws route
app.use("/listing/:_id", reviewRoute);

//for authentication use route
app.use("/", userRoute);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 404, message = "something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err: message });

})

let port = process.env.PORT || 3100;
app.listen(port, () => {
    console.log(`server on localhost${port}`);
});