const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
async function main() {
await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})
//basics
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
//css
app.use(express.static(path.join(__dirname,"/public")));
//link directory
app.set('views', path.join(__dirname, 'views'));
//extracting url
app.use(express.urlencoded({extended:true}));
//new added
// app.use(express.json());

app.get("/",(req,res)=>{
 res.send("Hi..how are you?")
});

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
app.get("/listings", wrapAsync(async (req, res) => {
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
app.get("/listings/new",wrapAsync(async (req,res)=>{
    res.render("listings/new"); 
 })); 
 
//create route
app.post("/listings",validateListing,wrapAsync(async (req,res)=>{
      let result=listingSchema.validate(req.body);
      console.log(result);
      let newListing=new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
     }));

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show", { listing });
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit", { listing });

}));

//update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    listing.set(req.body.listing);
    await listing.save();
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const DeletedListing=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log(DeletedListing);
}))

// app.get("/testListing",async (req,res)=>{
//    let sampleListing=new Listing({
//     title:"My New Villa",
//     description:"This is a beautiful villa with a pool",
//     price:1200,
//     location:"Bangalore",
//     image:"https://unsplash.com/photos/a-house-with-a-pool-in-the-yard-gLyBSJqGyk4",
//     country:"India"
//    });
//    await sampleListing.save();
//    console.log("Sample was saved");
//    res.send("Successful testing");
//    });

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page! not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("app is displaying");
});
