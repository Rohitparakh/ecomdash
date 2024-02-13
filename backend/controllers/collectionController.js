import asyncHandler from "express-async-handler";
import Collection from "../models/collectionModel.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

// @desc fetch all collections
// @route GET /api/collections
// @access Public
const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({});
  res.json(collections);
});

// @desc  fetch collections for categories page
// @route GET /api/collections/category
// @access Public
const getCategoryCollections = asyncHandler(async (req, res, next) => {
  const resultPerPage = 3;
  const collectionsCount = await Collection.countDocuments();

  const apiFeature = new ApiFeatures(Collection.find(), req.query)
    .search()
    .filter();

  let collections = await apiFeature.query;

  let filteredCollectionsCount = collections.length;

  apiFeature.pagination(resultPerPage);

  collections = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    collections,
    collectionsCount,
    resultPerPage,
    filteredCollectionsCount,
  });
});

// @desc fetch single collections
// @route GET /api/collections/:id
// @access Public
const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (collection) {
    res.json(collection);
  } else {
    res.status(404);
    throw new Error("Collection not found");
  }
});

// @desc delete a collection
// @route DELETE /api/collections/
// @access Private/Admin
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    await collection.remove();
    res.json({ message: "Collection removed" });
  } else {
    res.status(404);
    throw new Error("Collection not found");
  }
});

// @desc create a collection
// @route POST /api/collections/
// @access Private/Admin
const createCollection = asyncHandler(async (req, res) => {
  const collection = new Collection({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
  });
  const createdCollection = await collection.save();
  res.status(201).json(createdCollection);
});

// @desc update a collection
// @route PUT /api/collections/:id
// @access Private/Admin
const updateCollection = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    collection.name = name;
    collection.price = price;
    collection.description = description;
    collection.image = image;
    collection.brand = brand;
    collection.category = category;
    collection.countInStock = countInStock;
    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } else {
    res.status(404);
    throw new Error("Collection not found");
  }
});

// @desc    Create new review
// @route   POST /api/collections/:id/reviews
// @access  Private
const createCollectionReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const id = req.params.id;
  // console.log({ rating, comment, id });
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    const alreadyReviewed = collection.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    // console.log(alreadyReviewed);

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Collection already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    collection.reviews.push(review);

    collection.numReviews = collection.reviews.length;

    collection.rating =
      collection.reviews.reduce((acc, item) => item.rating + acc, 0) /
      collection.reviews.length;

    await collection.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Collection not found");
  }
});

export {
  getCollections,
  getCollectionById,
  deleteCollection,
  createCollection,
  updateCollection,
  createCollectionReview,
  getCategoryCollections,
};
