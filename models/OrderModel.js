import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: Array, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product"
        }
      }
    ],
    shippingAddress: {
      billingaddress: { type: String },
      billingcity: { type: String },
      billingcountry: { type: String },
      billingname: { type: String },
      billingstate: { type: String },
      billingzipcode: { type: String },
      email: { type: String },
      phone: { type: String },
      shippingaddress: { type: String },
      shippingcity: { type: String },
      shippingcountry: { type: String },
      shippingname: { type: String },
      shippingstate: { type: String },
      shippingzipcode: { type: String }
    },
    paymentMethod: {
      cardholdername: { type: String },
      cardnumber: { type: String },
      cvvnumber: { type: String },
      expirydate: { type: String },
      paymentmethod: { type: String }
    },
    status: {
      type: String,
      default: "Pending"
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    taxperproduct: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: String,
      default: "Pending"
    },
    deliveredAt: {
      type: Date
    },
    isGeoGenetics: { type: Boolean, default: false },
    governmentid: { type: String }
  },
  {
    timestamps: true
  }
);
OrderSchema.plugin(mongoosePaginate);
OrderSchema.index({ "$**": "text" });
const Order = mongoose.model("Order", OrderSchema);

export default Order;
