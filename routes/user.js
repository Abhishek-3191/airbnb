const express=require('express');
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

router.get("/signup",(req,res)=>{
  res.render("users/signup");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try {
    const {username,email,password}=req.body;
    const newUser=new User({email,username});
    let registeredUser=await User.register(newUser,password);

    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
          req.flash("success","Welcome to WanderLust");
          res.redirect("/listings")
    });
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup")
    }
    
}))
router.get("/login",(req,res)=>{
  res.render("users/login");
})
router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",
    {failureRedirect:'/login',
      failureFlash:true}),
      async(req,res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in!");
    let redirect=(res.locals.redirectUrl || "/listings");
    res.redirect(redirect);
});

router.get("/logout",(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Successfully logout");
    res.redirect("/listings");
  })
})

module.exports=router;