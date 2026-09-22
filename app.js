if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express =require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {reviewSchema} = require("./schema.js");




const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const { setDefaultAutoSelectFamily } = require("net");
const { connect } = require("http2");
const flash = require("connect-flash");
const passport =require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const dns = require('dns');
dns.setServers(['1.1.1.1','8.8.8.8']);


main()
.then(()=> console.log("connection successfully"))
.catch((err)=>console.log("Mongo Connection failed: ",err));

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}


const store = MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error",()=> { 
    console.log("error in Mongo session store:",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge : 7*24*60*60*1000,
        httpOnly:true,
    }
};





app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/",(req,res)=>{
//     res.send("this  is the home page");
// })




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("/{*splat}",(req,res,next)=>{
    next(new expressError(404,"page not found check your route again"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.render("error.ejs",{message})
    // res.status(status).send(message);
})




app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})