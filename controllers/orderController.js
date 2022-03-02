import Order from "../models/OrderModel.js";
import Mongoose from "mongoose";
import moment from "moment";

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
      user: userid,
      shippingAddress,
      paymentMethod,
      taxperproduct,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    res.status(200).json(createdOrder);
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

const updateOrderToDelivered = async (req, res) => {
  console.log("updateOrderToDelivered",req.params.id,req.body.status);
  const order = await Order.findById(req.params.id);
console.log('orderorder',order)
  if (order) {
 

    order.isDelivered = req.body.status
   
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    return res.status(400).json({ message: "Order not found" });
  }
};

export { addOrderItems, getOrderById, updateOrderToPaid, orderlogs, logs ,updateOrderToDelivered};
