import mongoose from "mongoose";

const InstructionTextSchema = mongoose.Schema(
  {
    text: {
      type: String
    },
   
  },
  {
    timestamps: true
  }
);
const InstructionText = mongoose.model("InstructionText", InstructionTextSchema);

export default InstructionText;
