const User = require("../models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
  };

module.exports.signup=async(req,res)=>{
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
    
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in!");
    let redirect=(res.locals.redirectUrl || "/listings");
    res.redirect(redirect);
};


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Successfully logout");
      res.redirect("/listings");
    })
  };