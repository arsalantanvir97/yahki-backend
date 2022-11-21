import Shipment from "../models/ShipmentModel";
import moment from "moment";
import Order from "../models/OrderModel";

const createShipment = async (req, res) => {
  const { name, from, to } = req.body;
  console.log("req.body", req.body);
  try {
    const ShipmentExists = await Shipment.findOne({ name });

    if (ShipmentExists) {
      res.status(400);
      throw new Error("Shipment name already exists");
    }

    const Shipmentt = new Shipment({
      name,
      from,
      to
    });
    console.log("Shipmentt", Shipmentt);

    const Shipmentcreated = await Shipmentt.save();
    console.log("Shipmentcreated", Shipmentcreated);
    if (Shipmentcreated) {
      res.status(201).json({
        Shipmentcreated
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const shipmentlogs = async (req, res) => {
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

    const shipment = await Shipment.paginate(
      {
        ...searchParam,
        ...status_filter,
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
      shipment
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getshipmentdetails = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ _id: req.params.id });
    console.log("shipment", shipment);

    const order = await Order.find({
      createdAt: {
        $gte: moment.utc(new Date(shipment.from)).startOf("day"),
        $lte: moment.utc(new Date(shipment.to)).endOf("day")
      }
    }).populate("user");;

    console.log("order", order);
    await res.status(201).json({
      shipment,
      order
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
export { createShipment, shipmentlogs, getshipmentdetails };
