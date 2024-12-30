const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");

const userController=require("../controllers/user.js");

const {isLoggedIn, saveRedirectUrl}=require("../middleware.js");

// //Api when signup button is clicked
// router.get("/signup",userController.renderSignupForm);
// //API when user wants to signup
// router.post("/signup",wrapAsync(userController.signup));
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash:true
    }),
   userController.login);


// // Login form route
// router.get("/login",userController.renderLoginForm);
// //login route
// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect:'/login',
//         failureFlash:true
//     }),
//    userController.login);

//Logout Route
router.get("/logout",isLoggedIn,userController.logout);



module.exports=router;
