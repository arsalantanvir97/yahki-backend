import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2";

const BookingSchema = mongoose.Schema(
    {

        name: {
            type: String,
        },
        email: {
            type: String,
        },
        occupation: {
            type: String,
        },
       
        user: {

            type: mongoose.Schema.Types.ObjectId,
      
            ref: "User"
      
        },
        event: {

            type: mongoose.Schema.Types.ObjectId,
      
            ref: "Event"
      
        },
    },
    {
        timestamps: true,
    }
)
BookingSchema.plugin(mongoosePaginate);
BookingSchema.index({ "$**": "text" });

const Booking = mongoose.model('Booking', BookingSchema)

export default Booking