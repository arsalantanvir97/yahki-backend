import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ShipmentSchema = mongoose.Schema(
  {
    name: { type: String },
    from: { type: Date },
    to: { type: Date }
  },
  {
    timestamps: true
  }
);
ShipmentSchema.plugin(mongoosePaginate);
ShipmentSchema.index({ "$**": "text" });

const Shipment = mongoose.model("Shipment", ShipmentSchema);

export default Shipment;
