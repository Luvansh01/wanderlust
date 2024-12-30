const Listing=require("./models/listing.js");
const ExpressError=require("./utils/expressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.user);
    // login authentication using passport
    if(!req.isAuthenticated()){
        // to save the original url -> to send the user to the url from where he was asked to login first
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You need to login first!");
        return res.redirect("/login");
        }
        next();
    };

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }
        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not authorized to edit.");
            return res.redirect(`/listings/${id}`);
        }
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/listings");
    }
};

// middleware function for server-side validation to add a new listing
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
   
    if(error){
        let errMessage=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMessage);
    }else{
        next();
    }

};

// middleware function for server-side validation to validate review form fields
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
    let errMessage=error.details.map((el)=>el.message).join(",");
        // console.log(error);
        throw new ExpressError(400,errMessage);
    }else{
        next();
    }

};



module.exports.isReviewAuthor = async (req, res, next) => {
   
        let {id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found.");
            return res.redirect(`/listings/${id}`);
        }
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not authorized to delete.");
            return res.redirect(`/listings/${id}`);
        }
        next(); // Proceed to the next middleware or route handler
    
};