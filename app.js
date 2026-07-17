const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
};

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expresserror.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// --- DB Connection ---
const dburl = process.env.ATLASDB_URL;

main()
    .then(() => { console.log("connected to database"); })
    .catch((err) => { console.log("error connecting to database", err); });

async function main() {
    await mongoose.connect(dburl);
}

// --- Basic Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// --- Session Options ---
const store = MongoStore.create({
    mongoUrl: dburl,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};



// --- Session & Flash (only ONCE) ---
app.use(session(sessionoptions));
app.use(flash());

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.search = req.query.search || "";
    next();
});

// --- Validate Listing Middleware ---
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// --- 404 Handler ---
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// --- Start Server ---
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});