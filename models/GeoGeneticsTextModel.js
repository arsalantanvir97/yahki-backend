import mongoose from "mongoose";

const GeoGeneticsTextSchema = mongoose.Schema(
  {
    text: {
      type: String
    },
   
  },
  {
    timestamps: true
  }
);
const GeoGeneticsText = mongoose.model("GeoGeneticsText", GeoGeneticsTextSchema);
export default GeoGeneticsText;
