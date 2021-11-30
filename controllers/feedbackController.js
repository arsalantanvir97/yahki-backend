import Feedback from "../models/FeedbackModel.js";
import moment from "moment";
import Product from "../models/ProductModel.js";

const createFeedback = async (req, res) => {
    const { id,firstName, lastName,email,type,subject,message } = req.body;
console.log('req.body',req.body)
    try {
      const feedback =new Feedback ({
        firstName,
        lastName,
        email,
        type,
        subject,
        message,
        id,}
      )
      console.log('feedback',feedback)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const feedbackcreated=await feedback.save()
    console.log('feedbackcreated',feedbackcreated)
      if (feedbackcreated) {
        res.status(201).json({
            feedbackcreated
        });
    } }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const Feedbacklogs = async (req, res) => {
    try {
      console.log('req.query.searchString',req.query.searchString)
      const searchParam = req.query.searchString
        ? { $text: { $search: req.query.searchString } }
        : {};
      const status_filter = req.query.status ? { status: req.query.status } : {};
      const from = req.query.from ;
      const to = req.query.to;
      let dateFilter = {};
      if (from && to)
        dateFilter = {
          createdAt: {
            $gte: moment.utc(new Date(from)).startOf("day"),
            $lte: moment.utc(new Date(to)).endOf("day"),
          },
        };
  
      const feedback = await Feedback.paginate(
        {
          ...searchParam,
          ...status_filter,
          ...dateFilter,
        },
        {
          page: req.query.page,
          limit: req.query.perPage,
          lean: true,
          sort: "-_id",
        }
      );
      await res.status(200).json({
        feedback,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const getFeedbackDetails = async (req, res) => {
    try {
      const feedback = await Feedback.findById(req.params.id).lean().select("-password");
      await res.status(201).json({
        feedback,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };

 


  export {createFeedback,Feedbacklogs,getFeedbackDetails};

