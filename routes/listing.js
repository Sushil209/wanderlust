const express = require("express");
const Review = require("../models/review");
const router = express.Router();
const Listing = require("../models/listing.js");
const Booking = require("../models/book.js")
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



// booking route

router.get("/booking/:id",isloggedIn,async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/book.ejs",{listing});
})

router.post("/booking/:id",isloggedIn,async(req,res)=>{
    let {id} = req.params;
    let {checkIn,checkOut,guests} = req.body;

    let booking = new Booking({
        checkIn : checkIn,
        checkOut : checkOut,
        guests : guests
    })
    await booking.save();
    req.flash("success","Booking Confirmed")
    res.redirect(`/listings/${id}`);
})


module.exports = router;