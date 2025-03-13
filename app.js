const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



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

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}
app.get("/",(req,res)=>{
 res.send("Hi..how are you?")
});
app.use(session(sessionOptions));

app.use(flash());
//flash is a middleware

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
  let registeredUser= await User.register(fakeUser,"helloWorld");
  res.send(registeredUser);
});



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



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
