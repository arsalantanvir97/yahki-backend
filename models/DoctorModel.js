import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const DoctorSchema = mongoose.Schema(
    {
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "DoctorCategory"
        },
        status: {
            type: Boolean,
            default: true
          },
      
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
        },
        timimgslot: {
            type: Array,
        },

        password: {
            type: String,
        },
        userImage: { type: String }
    },
    {
        timestamps: true
    }
);

DoctorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

DoctorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

DoctorSchema.plugin(mongoosePaginate);
DoctorSchema.index({ "$**": "text" });

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
