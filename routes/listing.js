const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage })


const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");


//get and create listing
router.route('/')
.get(wrapAsync(ListingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(ListingController.createListing)
);

//New route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

//search listing
// Search listings by country
router.get("/search", wrapAsync(ListingController.searchListings));


//show , put and delete
  router.route('/:id')
  .get( wrapAsync(ListingController.showListing))
  .put(
  
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(ListingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.deleteListing)
);
  

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.editListing)
);

module.exports = router;
