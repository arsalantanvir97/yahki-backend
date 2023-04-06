import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const DisputeSchema = mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
        type: String
      },
  
    email: {
      type: String
    },
    date: {
        type: Date
      },
    contact: {
      type: String
    },
    order: {
        type: String
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

    damage: {
      type: String
    },
    image: {
      type: String
    },
    description: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

DisputeSchema.plugin(mongoosePaginate);
DisputeSchema.index({ "$**": "text" });

const Dispute = mongoose.model("Dispute", DisputeSchema);

export default Dispute;
