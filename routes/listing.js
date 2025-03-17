const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");



//index route
router.get("/", wrapAsync(async (req, res) => {
    try {
      const allListings = await Listing.find({});
      // console.log("Fetched Listings:", allListings);
      res.render("listings/index", { allListings }); // No need for ".ejs" or starting with a "/"
    } 
    catch (error) {
        console.error("Error fetching listings:", error);
      res.status(500).send("An error occurred while fetching listings.");
    }
  }));

//new route
router.get("/new",isLoggedIn,wrapAsync(async (req,res)=>{
    res.render("listings/new"); 
 })); 
 
//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
      let result=listingSchema.validate(req.body);
      console.log(result);
      let newListing=new Listing(req.body.listing);
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success","New Listing created");
      res.redirect("/listings");
     }));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing you requested does not exist");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
}));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit", { listing });

}));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    // let listing=await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //   req.flash("error","You don't have access to it");
    //   return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const DeletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","New Listing deleted");
    res.redirect("/listings");
    console.log(DeletedListing);
}));
module.exports=router;