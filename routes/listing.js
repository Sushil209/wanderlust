const express = require("express");
const Review = require("../models/review");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isloggedIn, isOwner, validateReview } = require("../middleware.js");
const listingController = require("../controllers/listings.js")

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })



router.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedIn,upload.single('image[url]'),wrapAsync(listingController.createListing));

//new route

router.get("/new",isloggedIn,listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isloggedIn,isOwner,upload.single('image[url]'),wrapAsync(listingController.updateListing))
.delete(isloggedIn,isOwner,wrapAsync(listingController.deleteListing))

//edit route
router.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.editListing))

module.exports = router;