const mongoose = require("mongoose");

//Schema
const Schema= mongoose.Schema;

const reviewSchema = mongoose.Schema(
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      review: { type: String, required: true },
      // user: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   required: true,
      //   ref: "User",
      // },
    },
    {
      timestamps: true,
    }
  );
  
  const variationSchema = mongoose.Schema(
    {
      color: { type: String, required: true },
      image: { type: String, required: true },
      size: { type: Array, required: true },
      // user: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   required: true,
      //   ref: "User",
      // },
    },
    {
      timestamps: true,
    }
  );
  
  const productSchema = mongoose.Schema(
    {
      id: {
        type: String,
        required: true,
      },
      sku: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      model: {
        type: String,
        required: true,
      },
      weight: {
        type: String,
        required: true,
      },
      dimensions: {
        type: String,
        required: true,
      },
      material: {
        type: String,
        required: true,
      },
      otherInfo: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      offerEnd: {
        type: String,
        required: true,
      },
      new: {
        type: Boolean,
        required: true,
        default: true,
      },
      reviews: [reviewSchema],
      saleCount: {
        type: Number,
        required: true,
      },
      category: {
        type: Array,
        required: true,
      },
      tag: {
        type: Array,
        required: true,
      },
      variation: [variationSchema],
      image: {
        type: Array,
        required: true,
      },
      shortDescription: {
        type: String,
        required: true,
      },
      fullDescription: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
const allGroceriesSchema = new Schema({
    // id: Number,
    title: String,
    handle: String,
    description: String,
    categories: Array,
    tags: Array,
    featuredImageId: String,
    images: Array,
    priceTaxExcl: Number,
    priceTaxIncl: Number,
    taxRate: Number,
    comparedPrice: Number,
    quantity: Number,
    // sku: String,
    mrp: Number,
    extraShippingFee: Number,
    offer: Boolean,
    active: Boolean
})

// Model
const allGroceries=mongoose.model('allGroceries',allGroceriesSchema)

module.exports = allGroceries;