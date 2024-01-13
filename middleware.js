const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema,reviewSchema}= require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    //console.log(req.path," ",req.originalUrl);
    if(!req.isAuthenticated()){
        //redirect url after looged in 
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must login/sign up to Make changes");
        return res.redirect("/login");
    }next();
}
//function middleware where it doest allow to manipulate listing witout logging in 
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
   req.flash("error","Only Owner has permission to make changes ");
   return res.redirect(`/listings/${id}`);
   }next();
};

module.exports.valideListing= (req,res,next)=>{

    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.valideReview=(req,res,next)=>{

    let {error} =reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findByIdAndUpdate(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
   req.flash("error","Only Owner has permission to make changes ");
   return res.redirect(`/listings/${id}`);
   }next();
};