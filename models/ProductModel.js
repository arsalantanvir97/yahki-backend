import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ReviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const ProductSchema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin"
    },
    name: {
      type: String
    },
    visible: {
      type: Boolean
    },
    productimage: {
      type: Array
    },

    pricerange: {
      type: Array
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category"
    },
    description: {
      type: String
    },
    status: {
      type: Boolean
    },
    reviews: [ReviewSchema],
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    price: {
      type: Number
    },
    countInStock: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);
ProductSchema.plugin(mongoosePaginate);
ProductSchema.index({ "$**": "text" });
const Product = mongoose.model("Product", ProductSchema);

export default Product;
