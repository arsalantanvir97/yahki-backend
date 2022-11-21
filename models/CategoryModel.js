import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const CategorySchema = mongoose.Schema(
  {
    categorytitle: { type: String },

    description: { type: String },
    visible: { type: Boolean },
    categoryimage: { type: String },
    status: { type: Boolean, default: true },
    coursecount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
CategorySchema.plugin(mongoosePaginate);
CategorySchema.index({ "$**": "text" });

const Category = mongoose.model("Category", CategorySchema);

export default Category;
