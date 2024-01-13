const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);//reviews will be null if pass id parameter in app.js
        //to tackle that we use merge.params 

        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        let newReview=new Review(req.body.review);
        newReview.author=req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        
        req.flash("Success","Thanks for the review");
       res.redirect(`/listings/${listing._id}`); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.destroyReviw=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("Success","review deleted");
    res.redirect(`/listings/${id}`);
    //pull from reviews array 
    //here we use pull operator that removes from an exisitng array al instances of a value
    //values taht matches a specific condition
}