import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const MembershipSchema = mongoose.Schema(
    {


        firstname: { type: String },
        lastname: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        zipcode: { type: String },
        country: { type: String },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
          },
        city: { type: String },
        state: { type: String },
        dob: { type: String },
        hearaboutus: { type: String },
        termsservices: { type: String },
        privacypolicy: { type: String },
        membershipstatus: { type: String },

    },
    {
        timestamps: true
    }
);
MembershipSchema.plugin(mongoosePaginate);
MembershipSchema.index({ "$**": "text" });

const Membership = mongoose.model("Membership", MembershipSchema);

export default Membership;
