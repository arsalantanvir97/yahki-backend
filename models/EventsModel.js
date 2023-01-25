import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2";

const EventSchema = mongoose.Schema(
    {

        file: {
            type: String,
        },
        title: {
            type: String,
        },
        filetype: {
            type: String,
        },
        date: {
            type: Date,
        },
        desc: {
            type: String,
        },
        users: {

            type: Array,
      
           
      
          },
    },
    {
        timestamps: true,
    }
)
EventSchema.plugin(mongoosePaginate);
EventSchema.index({ "$**": "text" });

const Event = mongoose.model('Event', EventSchema)

export default Event