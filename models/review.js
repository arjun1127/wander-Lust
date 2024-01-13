const mongooose =require("mongoose");
const Schema = mongooose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
const Review = mongooose.model("Review",reviewSchema);
module.exports =Review;