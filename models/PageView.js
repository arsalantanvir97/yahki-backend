import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PageViewSchema = mongoose.Schema(
    {
        url: { type: String, },
        qty: { type: Number,default:1 },
      
    },
    {
        timestamps: true
    }
);

const PageView = mongoose.model("PageView", PageViewSchema);

export default PageView;
