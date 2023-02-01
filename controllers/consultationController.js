import Consultation from "../models/ConsultationModel";
import CreateNotification from "../utills/notification";
import Mongoose from "mongoose";

const createConsultation = async (req, res) => {
  try {
    const {
      consultationaddress,
      appointmenttime,
      appointmentdate,
      confirmationinfo,
      user
    } = req.body;
    let doc_schedule =
      req.files &&
      req.files.doc_schedule &&
      req.files.doc_schedule[0] &&
      req.files.doc_schedule[0].path;
    let datee = new Date(appointmentdate).toDateString();
    console.log("date", new Date(appointmentdate).toDateString());
    const consultationn = await Consultation.findOne({
      appointmentdate: datee
    });

    if (consultationn && consultationn.appointmenttime == appointmenttime) {
      return res.status(400).json({
        message: "Appointment slot already booked"
      });
    }
    const consultation = await Consultation.create({
      consultationaddress: JSON.parse(consultationaddress),
      appointmenttime,
      appointmentdate: datee,


      confirmationinfo: JSON.parse(confirmationinfo),
      user,
      governmentid: doc_schedule
    });
    if (consultation) {
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: `Appointment Created`,
        body: `A user having id of ${user} has just requested for an appointment on ${datee} ${appointmenttime}.`,
        payload: {
          type: "USER",
          id: user._id
        }
      };
      CreateNotification(notification);
      //   const notification = {
      //     notifiableId: null,
      //     notificationType: "Service",
      //     title: "Service Created",
      //     body: `A service with id of ${service._id} has been created`,
      //     payload: {
      //       type: "Service",
      //       id: service._id,
      //     },
      //   };
      //   CreateNotification(notification);
      console.log("consultation", consultation);
      res.status(201).json({
        consultation
      });
    } else {
      res.status(500);
      throw new Error("Invalid consultation data");
    }
  } catch (error) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const logs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
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

    const consultation = await Consultation.paginate(
      {
        ...searchParam,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort,
        populate: "user"
      }
    );
    await res.status(200).json({
      consultation
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const userlogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
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

    const consultation = await Consultation.paginate(
      {
        user: Mongoose.mongo.ObjectId(req.query.id),
        ...searchParam,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort,
        populate: "user"
      }
    );
    await res.status(200).json({
      consultation
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getConsultationDetails = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    await res.status(201).json({
      consultation
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    console.log("updateStatusupdateStatus");
    const consultation = await Consultation.findById(req.params.id);
    consultation.status = status;
    const notification = {
      notifiableId: consultation.user,
      notificationType: "USER",
      title: `Appointment Status Updated`,
      body: `Admin has updated status of your appointment to ${status}`,
      payload: {
        type: "USER",
        id: consultation.user
      }
    };
    await consultation.save();
    CreateNotification(notification);
    await res.status(201).json({
      consultation
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createConsultation,
  logs,
  getConsultationDetails,
  updateStatus,
  userlogs
};
