import Feedback from "../models/FeedbackModel.js";
import generateEmail from "../services/generate_email.js";
import moment from "moment";
const createFeedback = async (req, res) => {
  console.log("recoverPassword");
  const { firstName, lastName, email, reasonforcontacting, message } = req.body;
  const data = req.body;
  const feedback = new Feedback(data);
  console.log("feedback", feedback);

  const feedbackcreated = await feedback.save();
  const html = `<p>${firstName} ${lastName} from mail: ${email} sent you the following message.
  \n\n ${message}      
        </p>`;
  await generateEmail("info@yahkiawakened.com", "Yakhi - Contact Us", html);

  return res.status(201).json({
    message: "Message sent successfully to Yakhi"
  });
};

const FeedbackLogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              firstName: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            },
            {
              lastName: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            },
            {
              email: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            }
          ]
        }
      : {};
    let sort =
      req.query.sort == "asc"
        ? { createdAt: -1 }
        : req.query.sort == "des"
        ? { createdAt: 1 }
        : { createdAt: 1 };

    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day")
        }
      };

    const feedback = await Feedback.paginate(
      {
        ...searchParam,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort
      }
    );
    await res.status(200).json({
      feedback
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getFeedbackDetails = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    await res.status(201).json({
      feedback
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createFeedback, FeedbackLogs, getFeedbackDetails };
