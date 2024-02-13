const mongoose= require("mongoose");

//Schema
const Schema= mongoose.Schema;
const categoriesSchema=new Schema({
    id: Number,
    title: String
})

// Model
const categories=mongoose.model('categories',categoriesSchema)

module.exports = categories;