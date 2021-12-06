import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const DocumentSchema = mongoose.Schema(
  {
    pdfdocs: {
      type: String,
    },
    pdfname: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
DocumentSchema.plugin(mongoosePaginate);
DocumentSchema.index({ "$**": "text" });
const Document = mongoose.model("Document", DocumentSchema);

export default Document;
