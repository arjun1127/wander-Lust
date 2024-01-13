const User=require("../models/user");

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
     let{username,email,password}=req.body;
     const newUser=new User({email,username});
    const registerdUser=await User.register(newUser,password);
    req.login(registerdUser,(err)=>{
     if(err){
       return next(err);
     }
     req.flash("Success", "Welcome to WanderLust")
     res.redirect("/listings");
    });
    
    }catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
    }
 }

 module.exports.login= async (req, res) => {
    req.flash("Success","Welcome Back");
    let redirectUrl=res.locals.redirectUrl||"/listings";
      res.redirect(redirectUrl);
    }

    module.exports.logout=(req,res,next)=>{
    
        req.logout((err)=>{
            if(err){
              return next(err);
            }
            req.flash("Success","Logged Out");
          res.redirect("/listings");
        })
    }