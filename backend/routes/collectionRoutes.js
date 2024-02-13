import express from "express";
import {
  createCollection,
  createCollectionReview,
  deleteCollection,
  getCategoryCollections,
  getCollectionById,
  getCollections,
  updateCollection,
} from "../controllers/collectionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getCollections).post(protect, admin, createCollection);
router.route("/category").get(getCategoryCollections);
router.route("/:id/reviews").post(protect, createCollectionReview);
router
  .route("/:id")
  .get(getCollectionById)
  .delete(protect, admin, deleteCollection)
  .put(protect, admin, updateCollection);

export default router;
