import Order from "../models/OrderModel.js";
import Mongoose from "mongoose";
import moment from "moment";
import User from "../models/UserModel.js";
import CreateNotification from "../utills/notification.js";
import GeoGeneticsText from "../models/GeoGeneticsTextModel.js";

const addOrderItems = async (req, res) => {
  const {
    userid,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxperproduct,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: "No Order Items" });
  } else {
    const order = new Order({
      orderItems,
      user: req.id,
      shippingAddress,
      paymentMethod,
      taxperproduct,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });
    const notification = {
      notifiableId: null,
      notificationType: "Admin",
      title: `Order Created`,
      body: `An order of id ${order._id} has been created by a user having id ${req.id} `,
      payload: {
        type: "USER",
        id: req.id
      }
    };
    CreateNotification(notification);
    const createdOrder = await order.save();

    res.status(200).json(createdOrder);
  }
};
const addGeoGeneticsOrderItems = async (req, res) => {
  console.log("req.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.id", req.id);
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxperproduct,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;
    let doc_schedule =
      req.files &&
      req.files.doc_schedule &&
      req.files.doc_schedule[0] &&
      req.files.doc_schedule[0].path;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No Order Items" });
    } else {
      const order = new Order({
        orderItems: JSON.parse(orderItems),
        user: req.id,
        shippingAddress: JSON.parse(shippingAddress),
        paymentMethod: JSON.parse(paymentMethod),
        taxperproduct: Number(taxperproduct),
        governmentid: doc_schedule,
        isGeoGenetics: true,
        itemsPrice: Number(itemsPrice),
        taxPrice: Number(taxPrice),
        shippingPrice: Number(shippingPrice),
        totalPrice: Number(totalPrice)
      });
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: `Order Created`,
        body: `An order of id ${order._id} has been created by a user having id ${req.id} `,
        payload: {
          type: "USER",
          id: req.id
        }
      };
      CreateNotification(notification);
      const createdOrder = await order.save();

      res.status(200).json(createdOrder);
    }
  } catch (error) {
    console.log("error", error);
  }
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user");
  if (order) {
    res.status(200).json(order);
  } else {
    return res.status(400).json({ message: "Order not found" });
  }
};

const updateOrderToPaid = async (req, res) => {
  console.log("updateOrderToPaid");
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.status = "Paid";

    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    return res.status(400).json({ message: "Order not found" });
  }
};

const orderlogs = async (req, res) => {
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
    console.log("req.params.id", req.params.id);
    const order = await Order.paginate(
      {
        user: Mongoose.mongo.ObjectId(req.params.id),
        ...searchParam,
        ...status_filter,
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
      order
    });
  } catch (err) {
    console.log(err);
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
    const order = await Order.paginate(
      {
        ...searchParam,
        ...status_filter,
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
      order
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const geoGeneticslogs = async (req, res) => {
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
    const order = await Order.paginate(
      { isGeoGenetics: true, ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort,
        populate: "user"
      }
    );
    const geogenetictext=await GeoGeneticsText.findOne().lean()
    await res.status(200).json({
      order,
      geogenetictext
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updateOrderToDelivered = async (req, res) => {
  console.log("updateOrderToDelivered", req.params.id, req.body.status);
  const order = await Order.findById(req.params.id);
  console.log("orderorder", order);
  if (order) {
    order.isDelivered = req.body.status;

    const updatedOrder = await order.save();
    const notification = {
      notifiableId: null,
      notificationType: "User",
      title: `Order Delivered`,
      body: `An order of id ${order._id} status has been changed to delivered by admin`,
      payload: {
        type: "USER",
        id: req.id
      }
    };
    CreateNotification(notification);

    res.status(200).json(updatedOrder);
  } else {
    return res.status(400).json({ message: "Order not found" });
  }
};

const getCountofallCollection = async (req, res) => {
  try {
    const { year } = req.params;
    const yearuser = req.query.year ? req.query.year : [];

    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const start_date = moment(yearuser).startOf("year").toDate();
    const end_date = moment(yearuser).endOf("year").toDate();
    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date
          },
          isPaid: true
        }
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt"
          }
        }
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: "$totalPrice" }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1
        }
      }
    ];
    const [user, orderr, salesCount, totalcost] = await Promise.all([
      User.count(),
      Order.count(),
      Order.aggregate(query),
      Order.aggregate([
        {
          $match: {
            isPaid: true
          }
        },
        {
          $group: {
            _id: 1,

            countt: { $sum: "$totalPrice" }
          }
        },
        {
          $project: {
            countt: 1
          }
        }
      ])
    ]);
    console.log("salesCount", salesCount);
    salesCount.forEach((data) => {
      if (data) arr[data.month - 1] = data.count;
    });

    await res.status(201).json({
      user,
      orderr,
      graph_data: arr,
      totalcost
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getLatestOrders = async (req, res) => {
  try {
    const order = await Order.find()
      .sort({ $natural: -1 })
      .limit(3)
      .populate("user");

    await res.status(201).json({
      order
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editgeogeneticstext = async function (req, res) {
  const { text } = req.body;
  let editgeogenetics;
  try {
    editgeogenetics = await GeoGeneticsText.findOne();
    if (editgeogenetics) {
      editgeogenetics.text = text;
    } else {
      geogeneticsn = await GeoGeneticsText.create({
        text
      });
    }
    await editgeogenetics.save();
    res.status(201).json({
      editgeogenetics
    });
  } catch (error) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  orderlogs,
  logs,
  updateOrderToDelivered,
  getCountofallCollection,
  getLatestOrders,
  addGeoGeneticsOrderItems,
  geoGeneticslogs,
  editgeogeneticstext
};
