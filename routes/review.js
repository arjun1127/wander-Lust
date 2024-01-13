const express = require("express");
const router =express.Router({meregParams : true});//this defines id parameter in child route from parent rout //refer the below link
//https://expressjs.com/en/5x/api.html#router 
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {valideReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const controllerReview=require("../controllers/rewies.js");

router.post("/:id/reviews",
    isLoggedIn,
    valideReview,
    wrapAsync(controllerReview.createReview)
  );


//delete route
router.delete("/:id/reviews/:reviewId"
,isLoggedIn,
isReviewAuthor,
wrapAsync(controllerReview.destroyReviw));

module.exports=router;


