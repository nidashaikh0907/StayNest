const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//post Review Route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//delete route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.destoryReview));

module.exports = router;