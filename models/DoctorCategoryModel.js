import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const DoctorCategorySchema = mongoose.Schema(
  {
    title: { type: String },
    doctorcount: {
      type: Number,
      default: 0
    }
   
  },
  {
    timestamps: true
  }
);
DoctorCategorySchema.plugin(mongoosePaginate);
DoctorCategorySchema.index({ "$**": "text" });

const DoctorCategory = mongoose.model("DoctorCategory", DoctorCategorySchema);

export default DoctorCategory;
