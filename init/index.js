const mongoose = require("mongoose");
const initData  = require("../init/data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{console.log("connection successfully")})
.catch(err=>{console.log(error)})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=> ({...obj,owner:'6aa3ad46db1bc075d4a305dc'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
}

initDB();