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

     let url=req.file.path;
     let filename=req.file.filename;
    
      let newListing=new Listing(req.body.listing);
      newListing.owner=req.user._id;
      newListing.image={url,filename};
      await newListing.save();
      req.flash("success","New Listing created");
      res.redirect("/listings");
     };

//for updating

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=='undefined'){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
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
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit", { listing ,originalImageUrl});

};

//for deleting

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    const DeletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","New Listing deleted");
    res.redirect("/listings");
    console.log(DeletedListing);
};