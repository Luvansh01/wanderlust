const Listing=require("../models/listing");
const Review=require("../models/review");

//Reviews POST Route -> create new review
module.exports.createReview=async(req,res)=>{

    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    // console.log(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success","Review is added.");
    console.log("New review saved!");
    res.redirect(`/listings/${listing._id}`);
};

// review delete route
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Listing.findByIdAndDelete(reviewId);

    req.flash("success","Review is deleted.");
    res.redirect(`/listings/${id}`);
};