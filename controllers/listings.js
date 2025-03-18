const Listing=require("../models/listing");
const {listingSchema}=require("../schema");

//starting page

module.exports.index=async (req, res) => {
    try {
      const allListings = await Listing.find({});
      // console.log("Fetched Listings:", allListings);
      res.render("listings/index", { allListings }); // No need for ".ejs" or starting with a "/"
    } 
    catch (error) {
        console.error("Error fetching listings:", error);
      res.status(500).send("An error occurred while fetching listings.");
    }
  };

//for new form for creating

  module.exports.renderNewForm=async (req,res)=>{
    res.render("listings/new"); 
 };

//for displaying list

 module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",
      populate:{path:"author",},})
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested does not exist");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

//for create new list

module.exports.createListing=async (req,res)=>{
      let result=listingSchema.validate(req.body);
      console.log(result);
      let newListing=new Listing(req.body.listing);
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success","New Listing created");
      res.redirect("/listings");
     };

//for updating

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    // Preserve the original image if no new one is provided
    const updatedData = { ...req.body.listing };
    if (!req.body.listing.image) {
        updatedData.image = listing.image;  // Retain original image if none is provided
    } else {
        updatedData.image = { url: req.body.listing.image };  // Ensure correct structure
    }

    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//for editting

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit", { listing });

};

//for deleting

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    const DeletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","New Listing deleted");
    res.redirect("/listings");
    console.log(DeletedListing);
};