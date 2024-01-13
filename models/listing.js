const mongooose =require("mongoose");
const Review = require("./review.js");
const { string } = require("joi");

const Schema = mongooose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,

    image:{
        url: String,
        filename: String,
    },

    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    },
],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
},
geometry:{
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
},

/* category:{
    type:String,
    enum:["Trending","Rooms"],//etc add all
    then while creating a new listing provide a drop down to choose the listing ur creating comes under which filter
    then we'll put a filter in backend and the req goes to that filter , and that will return all the filters which 
    has clicked filter one ,and we can redicert it ..
    
    this is Home work

} */


});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing = mongooose.model("Listing",listingSchema);
module.exports =Listing;