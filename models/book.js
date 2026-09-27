
const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const bookingSchema = new Schema({
    checkIn:{
        type:Date,
        required:true
    },
    checkOut:{
        type:Date,
        required:true
    },
    guests:{
        type:Number,
        required:true,
        default:1
    }
})

const Booking =  mongoose.model("Booking",bookingSchema);
module.exports = Booking;
