import mongoose from "mongoose";

const videoSchema = mongoose.Schema(
  {
   
  
    video: {
      type: String,
      
    },
    thumbnail: {
      type: String,
      
    },
   
 
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;

