import mongoose from "mongoose";

const AppointmentFeesSchema = mongoose.Schema(
  {
    fees: { type: Number },

    date: { type: Date },
  },
  {
    timestamps: true
  }
);
AppointmentFeesSchema.index({ "$**": "text" });

const AppointmentFees = mongoose.model("AppointmentFees", AppointmentFeesSchema);

export default AppointmentFees;
