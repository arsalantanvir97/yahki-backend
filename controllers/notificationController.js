import Notification from "../models/NotificationModel.js";

const getallNotification = async (req, res) => {
  // console.log('getallNotification')
  try {
    const notification = await Notification.find({ notificationType: "Admin" });
    // console.log('notification',notification)
    await res.status(201).json({
      notification
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const usernotifications = async (req, res) => {
  try {
    console.log('req.id',req.id)
    const notification = await Notification.paginate(
      {
        notifiableId: req.id
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "_id"
      }
    );
    await res.status(200).json({
      notification
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { getallNotification, usernotifications };
