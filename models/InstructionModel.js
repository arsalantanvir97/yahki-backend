import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const InstructionSchema = mongoose.Schema(
  {
    videouri: {
      type: String
    },
    videotitle: {
      type: String
    },

    description: {
      type: String
    },
    status: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);
InstructionSchema.plugin(mongoosePaginate);
InstructionSchema.index({ "$**": "text" });
const Instruction = mongoose.model("Instruction", InstructionSchema);

export default Instruction;
