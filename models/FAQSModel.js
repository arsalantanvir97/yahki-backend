import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const FAQSSchema = mongoose.Schema(
  {
    question: { type: String },

    answer: { type: String },
    status: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);
FAQSSchema.plugin(mongoosePaginate);
FAQSSchema.index({ "$**": "text" });

const FAQS = mongoose.model("FAQS", FAQSSchema);

export default FAQS;
