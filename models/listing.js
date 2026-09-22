const mongoose = require("mongoose");
const review = require("./review");
const Schema =  mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    image:{
        filename:{
            type:String,
            default:"listingimage"
        },

        url:{
            type:String,
            default:"https://images.pexels.com/photos/2916821/pexels-photo-2916821.jpeg"
        }
        // type:String,
        // default:"https://unsplash.com/photos/solar-eclipse-behind-dark-clouds-zqVOhpb6yK4",
        // set:(v)=> v === ""? "https://unsplash.com/photos/solar-eclipse-behind-dark-clouds-zqVOhpb6yK4": v,
        
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;