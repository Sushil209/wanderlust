const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const { isloggedIn, isReviewAuthor } = require("../middleware.js");



const validateReview = (req,res,next)=>{
    let {error}  = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
};


const reviewcontroller = require("../controllers/review.js")


//post route
router.post("/",isloggedIn,validateReview,wrapAsync(reviewcontroller.createReview))


//delete route for reviews
router.delete("/:reviewId",isloggedIn,isReviewAuthor,wrapAsync(reviewcontroller.deleteReview))


module.exports = router;