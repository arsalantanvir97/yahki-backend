import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ConsultationSchema = mongoose.Schema(
  {
    consultationaddress: { type: Object },
    appointmenttime: { type: String },
    appointmentdate: { type: String },
    paymentinfo: { type: Object },
    confirmationinfo: { type: Object },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    governmentid: { type: String },
    // status: { type: String, default: "Pending" }
  },
  {
    timestamps: true
  }
);

ConsultationSchema.plugin(mongoosePaginate);
ConsultationSchema.index({ "$**": "text" });

const Consultation = mongoose.model("Consultation", ConsultationSchema);

export default Consultation;
