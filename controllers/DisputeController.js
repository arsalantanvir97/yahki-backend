import Dispute from "../models/DisputeModel";

const createDispute = async (req, res) => {
    const { firstName,
        lastName, date,
        email,
        contact,
        order,
        damage,
        description, } =
        req.body;
    let user_image =
        req.files &&
        req.files.user_image &&
        req.files.user_image[0] &&
        req.files.user_image[0].path;

    try {
        const disputee = await new Dispute({
            firstName, date,
            lastName,
            email,
            contact,
            order,
            damage,
            description, image: user_image,user:req.id
        });
        await disputee.save();
        await res.status(201).json({
            disputee
        });
    } catch (err) {
        console.log('err', err)
        res.status(500).json({
            message: err.toString()
        });
    }
};




const DisputeLogs = async (req, res) => {
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

        const dispute = await Dispute.paginate(
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
            dispute
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.toString()
        });
    }
};

const getDisputeDetails = async (req, res) => {
    try {
      const dispute = await Dispute.findById(req.params.id);
      await res.status(201).json({
        dispute
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  


export {
    createDispute,
    DisputeLogs,
    getDisputeDetails
};
