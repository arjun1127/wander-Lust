if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express = require("express");
const app =express();
const mongoose =require("mongoose");
const path =require("path");
const ejsMate =require("ejs-mate");
const methodOverride =require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash =require("connect-flash");
const passport=require("passport");
const localStaregy =require("passport-local");
const User =require("./models/user.js");

const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");
const user=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to Mdb");
}).catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const Store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

Store.on("error",()=>{
    console.log("Mongo session error ", err);
})
const sessionOptipons={
    Store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//this keeps the seesion details for 7 days -- 
        maxAge:1000*60*60*24*3,
        httpOnly:true,//for security
    }
};



app.use(session(sessionOptipons));
app.use(flash());
//config stratergy for hashing password 
//middleware that init
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStaregy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.Success=req.flash("Success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

/* app.get("/",(req,res)=>{
    res.send("hi")
}); */

/* app.get("/demoUser",async(req,res)=>{
    let fakeuser=new User({
        email:"ark@gmail.com",
        username:"ark"
    });
    //.register is a static method provided by npm
    let registerdUser =await User.register(fakeuser,"password");
    res.send(registerdUser);
}) */

app.use("/listings",listings);
app.use("/listings/", reviews);
app.use("/", user);

app.all("*",(req,res,next)=>{//handels errors for all routes which we have not defined
    next(new ExpressError(404,"page Not Found"));
});

app.use((err,req,res,next)=>{
    console.error(err);
    let{statusCode =500,message="Something went wrong"}=err;
  
    res.status(statusCode).render("error.ejs",{message});
});
app.listen(8080,()=>{
    console.log("app is listening");
});