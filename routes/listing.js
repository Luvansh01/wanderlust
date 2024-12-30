const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController=require("../controllers/listing.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});





// //index route
// router.get("/", wrapAsync(listingController.index));
// // Create route to respond to the form to add new listing
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,  
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.createListing)
);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner, upload.single("listing[image]"),  validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



// // show route
// router.get("/:id", wrapAsync(listingController.showListing));
// //update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));
// // delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;