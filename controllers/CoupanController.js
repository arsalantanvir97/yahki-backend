import Coupan from "../models/CoupanModel";

const createCoupan = async (req, res) => {
  const { title,
    minorderamount, startingdate, endingdate, coupan, discount } =
    req.body;

  console.log("req.bpdy", req.body);
  try {
    const couupan = await Coupan.create(req.body);
    await couupan.save();
    await res.status(201).json({
      couupan
    });
  } catch (err) {
      console.log('err',err)
    res.status(500).json({
      message: err.toString()
    });
  }
};




const CoupanLogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ?
      { $text: { $search: req.query.searchString } }

      : {};


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

    const couppan = await Coupan.paginate(
      {
        ...searchParam,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: '_id'
      }
    );
    await res.status(200).json({
      couppan
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};




export { createCoupan,
    CoupanLogs };
