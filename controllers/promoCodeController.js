import PromoCode from "../models/PromoCodeModel";

const createPromoCode = async (req, res) => {
  const { title, startingdate, endingdate, promocode, discount } =
    req.body;

  console.log("req.bpdy", req.body);
  try {
    const promocode = await PromoCode.create(req.body);
    await promocode.save();
    await res.status(201).json({
      promocode
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const applypromocode = async (req, res) => {
  const { promocode } = req.body;

  console.log("req.bpdy", req.body);
  try {
    const ridepromocode = await PromoCode.findOne({
      promocode: promocode
    }).select("promocode discount _id");
    if (ridepromocode) {
      await res.status(201).json({
        promocode: ridepromocode,
        message: "Valid PromoCode"
      });
    } else {
      await res.status(208).json({
        message: "Invalid PromoCode"
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getAllPromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.find().lean();
    await res.status(201).json({
      promoCode
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const PromoCodeLogs = async (req, res) => {
    try {
      console.log("req.query.searchString", req.query.searchString);
      const searchParam = req.query.searchString
        ?
         { $text: { $search: req.query.searchString } }
         
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
  
      const promocode = await PromoCode.paginate(
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
        promocode
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  

export { createPromoCode, getAllPromoCode, applypromocode ,PromoCodeLogs};
