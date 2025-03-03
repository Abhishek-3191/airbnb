const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>{
  let error=listingSchema.validate(req.body);
  console.log(error);
  if(error.error){
      let errMsg=error.error.details.map((el)=>el.message).join(", ");
      throw new ExpressError(400,errMsg);
  }
  else
  next();
}
//index route
router.get("/", wrapAsync(async (req, res) => {
    try {
      const allListings = await Listing.find({});
      console.log("Fetched Listings:", allListings);
      res.render("listings/index", { allListings }); // No need for ".ejs" or starting with a "/"
    } 
    catch (error) {
        console.error("Error fetching listings:", error);
      res.status(500).send("An error occurred while fetching listings.");
    }
  }));

//new route
router.get("/new",wrapAsync(async (req,res)=>{
    res.render("listings/new"); 
 })); 
 
//create route
router.post("/",validateListing,wrapAsync(async (req,res)=>{
      let result=listingSchema.validate(req.body);
      console.log(result);
      let newListing=new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
     }));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
}));

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit", { listing });

}));

//update route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    listing.set(req.body.listing);
    await listing.save();
    res.redirect("/listings");
}));

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const DeletedListing=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log(DeletedListing);
}));
module.exports=router;