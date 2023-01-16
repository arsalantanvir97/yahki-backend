import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    zipcode: { type: String },
    country: { type: String },
    password: {
      type: String,
      required: true
    },
    userImage: { type: String },
    city: { type: String },
    state: { type: String },
    dob: { type: String },
    hearaboutus: { type: String },
    termsservices: { type: String },
    privacypolicy: { type: String },
    membershipstatus: { type: String },

    status: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.plugin(mongoosePaginate);
UserSchema.index({ "$**": "text" });

const User = mongoose.model("User", UserSchema);

export default User;
