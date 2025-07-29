const express  = require("express");
const router = express.Router({mergeParams : true});
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require("../utils/WrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Review = require('../models/review.js')
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewController = require("../controllers/review.js")





// reviews post route
router.post("/" , isLoggedIn, validateReview , wrapAsync(reviewController.createReview))
//Delete review route
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;