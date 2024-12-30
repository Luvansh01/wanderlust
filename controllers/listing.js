const Listing=require("../models/listing");

//index route
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};
// New Form Route

module.exports.renderNewForm=(req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
};

// show route
module.exports.showListing= async(req, res) => {
    let { id } = req.params;
    // we use populate() to get all the detailes attached with object id of reviews and owner of the listing
    const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist :(");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

// Create route to respond to the form to add new listing
module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"...", filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    console.log(newListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings"); // Redirect to the listings page
};

// Edit Form Route
module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    // originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit", { listing ,originalImageUrl});
};

//Update Listing Route
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};

        await listing.save();
    }
    req.flash("success", "Updated successfully!");
    res.redirect("/listings");
};

// Delete Listing Route
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Deleted successfully!");
    res.redirect("/listings");

};