import PromoCode from "../models/PromoCodeModel";

const createPromoCode = async (req, res) => {
  const { title,
    minorderamount, startingdate, endingdate, status, promocode, discount } =
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
        sort: '_id'
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

const toggleActiveStatus = async (req, res) => {
  try {
    const product = await PromoCode.findById(req.params.id);
    console.log("product", product);
    product.status = product.status == true ? false : true;
    console.log("product", product);

    await product.save();
    console.log("service2", product);

    await res.status(201).json({
      message: product.status ? "PromoCode Activated" : "PromoCode Deactivated"
    });
  } catch (err) {
    console.log("error", err);

    res.status(500).json({
      message: err.toString()
    });
  }
};

const promoCodeDetails = async (req, res) => {
  try {
    const promocode = await PromoCode.findById(req.params.id)
    await res.status(201).json({
      promocode,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const editPromoCOde = async (req, res) => {
  const { id, title,
    minorderamount, startingdate, endingdate, status, promocode, discount } = req.body
  
  const promocodee = await PromoCode.findOne({ _id: id })
  promocodee.title = title
  promocodee.minorderamount = minorderamount
  promocodee.startingdate = startingdate
  promocodee.endingdate = endingdate
  promocodee.status = status
  promocodee.promocode = promocode
  promocodee.discount = discount

  await promocodee.save()
  // const notification = {
  //   notifiableId: null,
  //   notificationType: "Service",
  //   title: "Service UPdated",
  //   body: `A service with id of ${service._id} has been updated`,
  //   payload: {
  //     type: "Service",
  //     id: service._id,
  //   },
  // };
  // CreateNotification(notification);
  // await res.status(201).json({
  //   message: "service Update",
  //   service,
  // });
  await res.status(201).json({
    promocodee,
  })
}

export { createPromoCode, editPromoCOde,promoCodeDetails, getAllPromoCode, toggleActiveStatus, applypromocode, PromoCodeLogs };
