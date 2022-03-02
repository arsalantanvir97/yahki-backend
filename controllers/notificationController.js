import Notification from "../models/NotificationModel.js";

const getallNotification = async (req, res) => {
  // console.log('getallNotification')
    try {
      const notification = await Notification.find({notificationType:'Admin'});
      // console.log('notification',notification)
      await res.status(201).json({
        notification,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };

  export{getallNotification}