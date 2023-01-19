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
        name: { type: String,  },
        qty: { type: Number,  },
        image: { type: Array,  },
        price: { type: Number,  },
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
      billingfirstname: { type: String },
      billinglastname: { type: String },
      billingstate: { type: String },
      billingzipcode: { type: String },
      email: { type: String },
      signature: { type: String },
      phone: { type: String },
      shippingaddress: { type: String },
      disclaimer: { type: Boolean },
      shippingcity: { type: String },
      shippingcountry: { type: String },
      shippingfirstname: { type: String },
      shippinglastname: { type: String },
      shippingstate: { type: String },
      shippingzipcode: { type: String },
      yourinfofirstName: { type: String },
      yourinfolastName: { type: String },
      yourinfoemail: { type: String },
      yourinfophone: { type: String },
      yourinfoage: { type: String },
      yourinfoheight: { type: String },
      yourinfoweight: { type: String },
      yourinfoethnicity: { type: String },
      yourinfoconsultaionfor: { type: String },
      yourinfosetcurrentmedication: { type: String },
      yourinfodiagnosis: { type: String },
      yourinfodoc_schedule: { type: String },
    },
    paymentMethod: {
      // cardholdername: { type: String },
      // cardnumber: { type: String },
      // cvvnumber: { type: String },
      // expirydate: { type: String },
      // paymentmethod: { type: String }
      type: String
    },
    
    status: {
      type: String,
      default: "Pending"
    },

    taxPrice: {
      type: Number,
      
      default: 0.0
    },
    taxperproduct: {
      type: Number,
      
      default: 0.0
    },
    shippingPrice: {
      type: Number,
     
      default: 0.0
    },
    totalPrice: {
      type: Number,
      
      default: 0.0
    },
    isPaid: {
      type: Boolean,
     
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
    paymentResultData: {
      type: Object
    },
    paymentResultDetails: {
      type: Object
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
