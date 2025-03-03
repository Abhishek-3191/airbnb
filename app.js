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
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js")

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





app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



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
