import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const TaxSchema = mongoose.Schema(
  {
  
    state: { type: String },
    percent: { type: Number },

    status: { type: Boolean ,default:true},
  },
  {
    timestamps: true,
  }
);
TaxSchema.plugin(mongoosePaginate);
TaxSchema.index({ "$**": "text" });

const Tax = mongoose.model("Tax", TaxSchema);

export default Tax;
