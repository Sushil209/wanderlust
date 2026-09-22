const express = require("express");
const app = express();
const session = require('express-session');
const flash = require("connect-flash");
const path = require("path");
const sessionOptions = session({ 
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.engine('ejs',ejsMate);

app.use(sessionOptions);
app.use(flash());


app.use((req,res,next)=>{
     res.locals.success = req.flash("success");
    res.locals.failed = req.flash("failed");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    if(name =="anonymous"){
        req.flash("failed","user registration unsuccessfull!");
    }else{
        req.flash("success","user register successfull!");
    }
    
    
    res.redirect("/hello");
})



app.get("/hello",(req,res)=>{
   
    res.render("page.ejs",{name:req.session.name})
})

// app.get("/reqcount", (req, res) => {
//    if( req.session.count){
//      req.session.count++;
//    }else{
//      req.session.count = 1;
//    }
//     res.send(`you sent a request ${req.session.count} times`);
// })


app.listen("3000", (req, res) => {
    console.log("server is working  on port 3000");
})