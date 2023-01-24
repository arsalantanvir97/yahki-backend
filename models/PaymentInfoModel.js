import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PaymentInfoSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        cardholdername: {
            type: String,

        }, cardnumber: {
            type: String,

        }, cvvnumber: {
            type: String,

        }, expirydate: {
            type: String,

        }, paymentmethod: {
            type: String,
        },

    },
    {
        timestamps: true
    }
);
PaymentInfoSchema.plugin(mongoosePaginate);
PaymentInfoSchema.index({ "$**": "text" });
const PaymentInfo = mongoose.model("PaymentInfo", PaymentInfoSchema);

export default PaymentInfo;
