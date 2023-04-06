import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const TagSchema = mongoose.Schema(
  {
    title: { type: String },

    productcount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
TagSchema.plugin(mongoosePaginate);
TagSchema.index({ "$**": "text" });

const Tag = mongoose.model("Tag", TagSchema);

export default Tag;
