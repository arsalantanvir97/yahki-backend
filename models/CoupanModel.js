import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CoupanSchema = mongoose.Schema(
  {
    title: {
      type: String
    },
    startingdate: {
      type: Date
    },
    endingdate: {
      type: Date
    },
    coupan: {
      type: String
    },

    discount: {
      type: Number
    },
    minorderamount: {
      type: Number
    },
    usersavailed: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

CoupanSchema.plugin(mongoosePaginate);
CoupanSchema.index({ "$**": "text" });

const Coupan = mongoose.model("Coupan", CoupanSchema);

export default Coupan;
