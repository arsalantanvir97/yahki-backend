import mongoose from "mongoose";

const EattoliveTextSchema = mongoose.Schema(
  {
    text: {
      type: String
    },
   
  },
  {
    timestamps: true
  }
);
const EattoliveText = mongoose.model("EattoliveText", EattoliveTextSchema);

export default EattoliveText;
