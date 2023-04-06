import FAQS from "../models/FAQSModel";
import moment from "moment";
import FAQVideo from "../models/FAQVIdeoModel";

const createfaqs = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const faqs = new FAQS(req.body);
    console.log("faqs", faqs);

    const faqscreated = await faqs.save();
    console.log("faqscreated", faqscreated);
    if (faqscreated) {
      res.status(201).json({
        faqscreated
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const faqslogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};

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

    const faqs = await FAQS.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "_id"
      }
    );
    const faqss = await FAQVideo.findOne().lean();

    await res.status(200).json({
      faqs,
      faqss
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getfaqsdetails = async (req, res) => {
  try {
    const faqs = await FAQS.findOne({ _id: req.params.id });
    console.log("faqs", faqs);

    await res.status(201).json({
      faqs
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const editfaqs = async (req, res) => {
  const { question, answer } = req.body;
  console.log("req.body", req.body);
  try {
    const tax = await FAQS.findOne({ _id: taxid });
    console.log("tax", tax);
    tax.state = state;
    tax.percent = percent;
    await tax.save();
    console.log("tax", tax);

    res.status(201).json({
      message: "Tax Updated Successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getallfaqs = async (req, res) => {
  try {
    const faqs = await FAQS.find().lean();
    const faqqs = await FAQVideo.findOne().lean();

    res.status(201).json({
      faqs,
      faqqs
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    });
  }
};
const faqvideo = async (req, res) => {
  let ad_video =
    req.files &&
    req.files.ad_video &&
    req.files.ad_video[0] &&
    req.files.ad_video[0].path;
  try {
    await FAQVideo.findOneAndUpdate(
      {},
      { videouri: ad_video },
      { new: true, upsert: true, returnNewDocument: true }
    );
    res.status(201).json({
      message: "Video Uploaded Successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    });
  }
};

export { createfaqs, faqslogs, getfaqsdetails, editfaqs, getallfaqs, faqvideo };
