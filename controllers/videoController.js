import Video from "../models/VideoModel";




const uploadVideo = async (req, res) => {
    try {
        const video_file =
            req.files && req.files.video_file && req.files.video_file[0] && req.files.video_file[0].path;
        const thumbnail =
            req.files && req.files.thumbnail && req.files.thumbnail[0] && req.files.thumbnail[0].path;


        const video = new Video({

            video: video_file,
            thumbnail,

        });

        await video.save();

        await res.status(201).json({
            message: "Video Uploaded",
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};
const getVideo = async (req, res) => {
    try {
        const video = await Video.findOne().lean();
        await res.status(201).json({
            video
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};
export { uploadVideo ,getVideo}
