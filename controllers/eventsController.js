import Event from "../models/EventsModel";
import moment from "moment";

const createevents = async (req, res) => {
    const { title,
        date,filetype,
        desc } = req.body;

    console.log("req.body", req.body);
  
        let user_image =
        req.files &&
        req.files.user_image &&
        req.files.user_image[0] &&
        req.files.user_image[0].path;
    try {
        const event = new Event({
            title,
            date,
            desc,
            filetype,
            file: user_image
        });
        console.log("event", event);

        const eventcreated = await event.save();
        console.log("eventcreated", eventcreated);
        if (eventcreated) {
            res.status(201).json({
                eventcreated
            });
        }
    } catch (err) {
        console.log("err", err);
        res.status(500).json({
            message: err.toString()
        });
    }
};

const eventslogs = async (req, res) => {
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
            let sort =
            req.query.sort == "asc"
              ? { createdAt: -1 }
              : req.query.sort == "des"
              ? { createdAt: 1 }
              : { createdAt: 1 };
        
        const event = await Event.paginate(
            {
                ...searchParam,
                ...status_filter,
                ...dateFilter
            },
            {
                page: req.query.page,
                limit: req.query.perPage,
                lean: true,
                sort:sort,
            }
        );

        await res.status(200).json({
            event
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.toString()
        });
    }
};

const geteventsdetails = async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id });
        console.log("event", event);

        await res.status(201).json({
            event
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString()
        });
    }
};
const editevents = async (req, res) => {
    const { title,
        date,
        desc, id } = req.body;

    console.log("req.body", req.body);
    let user_image =
        req.files &&
        req.files.user_image &&
        req.files.user_image[0] &&
        req.files.user_image[0].path;

    console.log("req.body", req.body);
    try {
        const event = await Event.findOne({ _id: id });
        event.title = title;
        event.date = date;
        event.desc = desc;
        event.file = user_image ? user_image : event.file;

        await event.save();
        console.log("event", event);

        res.status(201).json({
            message: "Event Updated Successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString()
        });
    }
};
const userevents = async (req, res) => {
    var now = moment().toDate();

  try {
    const events = await Event.find({date:{
        $gte: now
    }}).lean();

    res.status(201).json({
        events
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    });
  }
};


export {
    createevents,
    geteventsdetails,
    eventslogs,
    editevents,
    userevents
};
