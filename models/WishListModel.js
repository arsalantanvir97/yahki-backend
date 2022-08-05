import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2";

const ReviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const WishListSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
  },
  {
    timestamps: true,
  }
)
WishListSchema.plugin(mongoosePaginate);
WishListSchema.index({ "$**": "text" });
const WishList = mongoose.model('WishList', WishListSchema)

export default WishList
