import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    new: {
      type: Boolean,
      required: true,
      default: true,
    },
    category: {
      type: Array,
      required: true,
    },
    tag: {
      type: Array,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
