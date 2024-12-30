const User=require("../models/user");

// Render signup form
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

//API when user wants to signup
module.exports.signup=async(req,res) => {
    try{ 
        let{username,email,password}=req.body;
    const newUser=new User({email,username});
    let registeredUser=await User.register(newUser,"12345");
    console.log(registeredUser);
    // Jab signup ho jaye to automatically login kara de
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success",`Welcome to Wanterlust ${newUser.username}`);
        res.redirect("/listings");
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    } 
};

// Render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

//Login route
module.exports.login= async(req,res)=>{
        let {username}=req.body;
        req.flash("success",`Welcome ${username}, you are logged in succesfully!`);
        let redirectUrl=res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);
};

//Logout Route
module.exports.logout=(req,res,next)=>{
    req.logOut(err=>{
        if(err){
           return next(err);
        }
        req.flash("success","Successfully Logged Out! ");
        res.redirect("/listings");
    })
};