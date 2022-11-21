import mongoose from "mongoose";

const FAQVideoSchema = mongoose.Schema(
    {
    videouri: { type: String, }
    },
    {
      timestamps: true,
    }
  )
 

const FAQVideo = mongoose.model("FAQVideo", FAQVideoSchema);

export default FAQVideo;