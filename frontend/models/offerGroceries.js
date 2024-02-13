const mongoose= require("mongoose");

//Schema
const Schema= mongoose.Schema;
const offerGroceriesSchema=new Schema({
    id: Number,
    title: String,
    imgSrc: String,
    price:Number,
    mrp:Number
})

// Model
const offerGroceries=mongoose.model('offerGroceries',offerGroceriesSchema)

module.exports = offerGroceries;