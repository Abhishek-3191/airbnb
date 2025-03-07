const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const validateReview=(req,res,next)=>{
    let error=reviewSchema.validate(req.body);
    console.log(error);
    if(error.error){
        let errMsg=error.error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errMsg);
    }
    else
    next();
}

//reviews
//post
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success","New Listing created");
   console.log("New review saved")
//    res.send("New review saved")
return res.redirect(`/listings/${listing._id}`); 
}));

//Delete route for review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","New Listing deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;

