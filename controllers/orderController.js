import Order from "../models/OrderModel.js";
import Mongoose from "mongoose";
import moment from "moment";
import User from "../models/UserModel.js";
import CreateNotification from "../utills/notification.js";
import GeoGeneticsText from "../models/GeoGeneticsTextModel.js";
import PaymentInfo from "../models/PaymentInfoModel.js";
import generateJWTtoken from "../utills/generateJWTtoken.js";

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
  console.log('req.body', req.body, 'req.body.totalPrice', req.body.totalPrice)
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
  console.log(
    "req.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.idreq.id",
    req.id
  );
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
    order.paymentResultData = req.body.paymentResultData;
    order.paymentResultDetails = req.body.paymentResultDetails;

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
const nogeoorderlogs = async (req, res) => {
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
      {isGeoGenetics: false,
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
    const geogenetictext = await GeoGeneticsText.findOne().lean();
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
    const { year } = req.query;
    const yearuser = req.query.year ? req.query.year : [];

    // const yearuser2 = req.query.year2 ? req.query.year2 : [];

    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const userarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const orderarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const start_date = moment(yearuser).startOf("year").toDate();
    const end_date = moment(yearuser).endOf("year").toDate();

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date
          },
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
          totalorders: { $sum: 1 }
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
          totalorders: 1
        }
      }
    ];
    const query2 = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date
          },
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
          totalusers: { $sum: 1 }

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
          totalusers: 1
        }
      }
    ];
    const query3 = [
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          },
        }
      },
      {
        $group: {
          _id: 1,

          total: { $sum: "$totalPrice" }
        }
      },

      {
        $project: {
          _id: 0,
          total: 1
        }
      }
    ];
    const query4 = [
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          },
        }
      },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.name', topSeller: { $sum: '$orderItems.qty' }
        }
      },
      { $sort: { 'topSeller': -1 } },
    ];
    const query5 = [
      { $unwind: '$orderItems', },
      {
        $group: {
          _id: '$orderItems.name', topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }

        }
      },
      { $sort: { 'topSeller': -1 } },
    ];



    const query9 = [
      { $unwind: '$orderItems' },

      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },

      {
        $group: {
          _id: '$orderItems.product.category',
          topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }, data: {
            $push: "$$ROOT"
          },

        }
      },
      { $sort: { 'topSeller': -1 } },

    ];



    const [user, orderr, netSalesMonth, topSeller, overallTopSeller, limitedOrders, salesCount, topcategoriesItemsSold, totalcost, users, ,] = await Promise.all([
      User.count(),
      Order.count(),
      Order.aggregate(query3),
      Order.aggregate(query4),
      Order.aggregate(query5),
      Order.find({
        createdAt: {
          $gte: moment(req.query.year3).startOf("year").toDate(),
          $lte: moment(req.query.year3).endOf("year").toDate()
        }
      }).populate('user').limit(5).lean(),

      Order.aggregate(query),
      Order.aggregate(query9),

      Order.aggregate([

        {
          $group: {
            _id: 1,

            countt: { $sum: "$totalPrice" }
          }
        },
        {
          $project: {
            _id: 0,
            countt: 1
          }
        }
      ]),
      User.aggregate(query2),


    ]);
    console.log('users',)
    salesCount.forEach((data) => {
      if (data) arr[data.month - 1] = data.totalorders;
    });
    users.forEach((data) => {
      if (data) userarr[data.month - 1] = data.totalusers;
    });


    await res.status(201).json({
      user,
      orderr,
      netSalesMonth, topSeller, overallTopSeller,
      graph_data: arr,
      totalcost,
      user_graph: userarr,
      avgItemPerOrder: totalcost.length > 0 & totalcost[0].countt / overallTopSeller.length.toFixed(0),
      limitedOrders,
      topcategoriesItemsSold,
      // avgOrdervalue: orderbysalesgraph[0].count / orderbysalesgraph[0].data.length

    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const topCategoriestemsSold = async (req, res) => {
  try {

    const start_date5 = moment(req.query.year5).startOf("year").toDate();
    const end_date5 = moment(req.query.year5).endOf("year").toDate();

    const query11 = [
      {
        $match: {
          createdAt: {
            $gte: start_date5,
            $lte: end_date5
          },
        }
      },
      { $unwind: '$orderItems', },
      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $group: {
          _id: '$orderItems.product.category', topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }

        }
      },
      {
        $addFields: {
          catid: "$orderItems.product.category"
        }
      },

      { $sort: { 'topSeller': -1 } },
    ];


    const [topCategoiresItemsSoldbyyear] = await Promise.all([
      Order.aggregate(query11),

    ])

    await res.status(201).json({
      topCategoiresItemsSoldbyyear,



    });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({
      message: err.toString()
    });
  }
};
const categoriesummary = async (req, res) => {
  const category = req.query.category ? req.query.category : '6241603e1b97a530529276bb';

  const catarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  
  const start_date4 = moment(req.query.year4).startOf("year").toDate();
  const end_date4 = moment(req.query.year4).endOf("year").toDate();

  try {
    const query8 = [
      {
        $match: {
          createdAt: {
            $gte: start_date4,
            $lte: end_date4
          },
        }
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt"
          }
        }
      },

      { $unwind: '$orderItems' },

      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $match: {
          'orderItems.product.category': Mongoose.mongo.ObjectId(category)
        }
      }, {
        $group: {
          _id: '$date',
          topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      }, {
        $project: {
          _id: 0,
          month: 1,
          netSales: 1,
          topSeller: 1
        }
      },

    ];
    const query7 = [
      { $unwind: '$orderItems' },

      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $match: {
          createdAt: {
            $gte: start_date4,
            $lte: end_date4
          },
          'orderItems.product.category': Mongoose.mongo.ObjectId(category),
          // data2:
          //   "$$ROOT"
          // ,
        }
      },
      {
        $group: {
          _id: '$orderItems.product.category',
          topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }, data: {
            $push: "$$ROOT"
          },

        }
      },
    ];
   
    const [categoryOrders, categorygraph, totalorders] = await Promise.all([
      Order.aggregate(query7),
      Order.aggregate(query8),

      Order.aggregate([{
        $match: {
          createdAt: {
            $gte: start_date4,
            $lte: end_date4
          },
        }
      },
      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $match: {
          'orderItems.product.category': Mongoose.mongo.ObjectId(category)
        }

      },]),

    ])
    categorygraph.forEach((data) => {
      if (data) catarr[data.month - 1] = data.topSeller;
    });
   
    
    await res.status(201).json({
      categoryOrders, categorygraph,
      categorygraph: catarr,
      totalorders,

    });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({
      message: err.toString()
    });
  }
};
const analysisproducts = async (req, res) => {

  const catarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  
  const start_date4 = moment(req.query.year4).startOf("year").toDate();
  const end_date4 = moment(req.query.year4).endOf("year").toDate();

  try {
    const query8 = [
      {
        $match: {
          createdAt: {
            $gte: start_date4,
            $lte: end_date4
          },
        }
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt"
          }
        }
      },

      { $unwind: '$orderItems' },

      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $group: {
          _id: '$date',
          topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      }, {
        $project: {
          _id: 0,
          month: 1,
          netSales: 1,
          topSeller: 1
        }
      },

    ];
    const query7 = [
      { $unwind: '$orderItems' },

      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $match: {
          createdAt: {
            $gte: start_date4,
            $lte: end_date4
          },
          // data2:
          //   "$$ROOT"
          // ,
        }
      },
      {
        $group: {
          _id: '$orderItems.product.name',
          topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }, data: {
            $push: "$$ROOT"
          },

        }
      },
    ];
   
    const [categoryOrders, categorygraph, totalorders] = await Promise.all([
      Order.aggregate(query7),
      Order.aggregate(query8),

      Order.aggregate([{
        $match: {
          createdAt: {
            $gte: start_date4,
            $lte: end_date4
          },
        }
      },
      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      ]),

    ])
    let netsales=categorygraph.length > 0&&categorygraph[0].netSales
    console.log(categorygraph,'categorygraph')
    categorygraph.forEach((data) => {
      if (data) catarr[data.month - 1] = data.topSeller;
    });
   let totalitemssold=0
   catarr.map(caat=>totalitemssold=totalitemssold+caat)
    
    await res.status(201).json({
      categoryOrders,
      categorygraph: catarr,
      totalorders,totalitemssold,
      netsales

    });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({
      message: err.toString()
    });
  }
};


const ordersummaryrevenue = async (req, res) => {
  try {

    const orderarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const start_date2 = moment(req.query.year2).startOf("year").toDate();
    const end_date2 = moment(req.query.year2).endOf("year").toDate();
    // const query10 =
    // [
    //   {
    //     $match: {
    //       createdAt: {
    //         $gte: start_date2,
    //         $lte: end_date2
    //       },
    //     }
    //   },


    //   { $unwind: '$orderItems' },

    //   // { $unwind: '$orderr' },


    //   // { $unwind: '$data.orderItems' },

    // ];
    const query6 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date2,
              $lte: end_date2
            },
          }
        },
        {
          $addFields: {
            date: {
              $month: "$createdAt"
            },
          }
        },

        {
          $group: {
            _id: "$date",
            count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },

        {
          $addFields: {
            month: "$_id",
          }
        },
        // { $unwind: '$orderr' },

        {
          $project: {
            _id: 0,
            month: 1,
            data: 1,
            count: 1,
          }
        },
        // { $unwind: '$data.orderItems' },

      ];
    const query12 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date2,
              $lte: end_date2
            },
          }
        },


        {
          $group: {
            _id: 0,
            count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },



      ];
    const [orderbysalesgraph, ordersummarydata, allitems      // avgOrdervalue: orderbysalesgraph[0].count / orderbysalesgraph[0].data.length
    ] = await Promise.all([
      Order.aggregate(query6),


      Order.aggregate(query12),
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start_date2,
              $lte: end_date2
            },
          }
        },


        { $unwind: '$orderItems' },
      ]),


    ]);

    orderbysalesgraph.forEach((data) => {
      if (data) orderarr[data.month - 1] = data.count;
    });

    await res.status(201).json({
      ordersummarydata, ordergraph: orderarr, allitems

      // avgOrdervalue: ordersummarydata[0].count / ordersummarydata[0].data.length

    });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({
      message: err.toString()
    });
  }
};
const overviewdata = async (req, res) => {
  try {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const orderarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const start_date = moment(req.query.year2).startOf("year").toDate();
    const end_date = moment(req.query.year2).endOf("year").toDate();

    const start_date2 = moment(req.query.year).startOf("year").toDate();
    const end_date2 = moment(req.query.year).endOf("year").toDate();
    const start_date3 = moment(req.query.year3).startOf("year").toDate();
    const end_date3 = moment(req.query.year3).endOf("year").toDate();
    const overallprod = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const query10 = [
      {
        $match: {
          createdAt: {
            $gte: start_date2,
            $lte: end_date2
          },
        }
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt"
          }
        }
      },

      { $unwind: '$orderItems' },

      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      // {
      //   $match: {
      //     'orderItems.product.category': Mongoose.mongo.ObjectId(category)
      //   }
      // },
       {
        $group: {
          _id: '$date',
          topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      }, {
        $project: {
          _id: 0,
          month: 1,
          netSales: 1,
          topSeller: 1
        }
      },

    ];

    const query6 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date2,
              $lte: end_date2
            },
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
            count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },

        {
          $addFields: {
            month: "$_id",
          }
        },
        // { $unwind: '$orderr' },

        {
          $project: {
            _id: 0,
            month: 1,
            data: 1,
            count: 1,
          }
        },
        // { $unwind: '$data.orderItems' },

      ];

    const query11 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date2,
              $lte: end_date2
            },
          }
        },


        { $unwind: '$orderItems' },
        {
          $group: {
            _id: "$orderItems.product",
            // count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },
        // { $unwind: '$orderr' },


        // { $unwind: '$data.orderItems' },

      ];
    const query22 = [
      {
        $match: {
          createdAt: {
            $gte: start_date3,
            $lte: end_date3
          },
        }
      },
      { $unwind: '$orderItems', },
      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $group: {
          _id: '$orderItems.product.category', topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }

        }
      },
      {
        $addFields: {
          catid: "$orderItems.product.category"
        }
      },

      { $sort: { 'topSeller': -1 } },
    ];
    const query66 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date,
              $lte: end_date
            },
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
            count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },

        {
          $addFields: {
            month: "$_id",
          }
        },
        // { $unwind: '$orderr' },

        {
          $project: {
            _id: 0,
            month: 1,
            data: 1,
            count: 1,
          }
        },
        // { $unwind: '$data.orderItems' },

      ];
    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date
          },
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
          totalorders: { $sum: 1 }
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
          totalorders: 1
        }
      }
    ];
    const query5 = [
      {
        $match: {
          createdAt: {
            $gte: start_date3,
            $lte: end_date3
          },
        }
      },
      { $unwind: '$orderItems', },
      {
        $group: {
          _id: '$orderItems.name', topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }

        }
      },
      { $sort: { 'topSeller': -1 } },
    ];
    const [overvieworders, allproducts, overallproduct,orderbysalesgraph, salesCount, topCategoiresItemsSoldbyyear, overallTopSeller] = await Promise.all([
      Order.aggregate(query6),
      Order.aggregate(query11),
      Order.aggregate(query10),

      Order.aggregate(query66),
      Order.aggregate(query),
      Order.aggregate(query22),
      Order.aggregate(query5),
      Order.find({
        createdAt: {
          $gte: moment(req.query.year3).startOf("year").toDate(),
          $lte: moment(req.query.year3).endOf("year").toDate()
        }
      }).populate('user').limit(5).lean(),

    ]);
    console.log('salesCount', salesCount)
    orderbysalesgraph.forEach((data) => {
      if (data) orderarr[data.month - 1] = data.count;
    });
    salesCount.forEach((data) => {
      if (data) arr[data.month - 1] = data.totalorders;
    });
    overallproduct.forEach((data) => {
      if (data) overallprod[data.month - 1] = data.topSeller;
    });

    await res.status(201).json({
      overvieworders,
      allproducts,
      orderbysalesgraph: orderarr,

      totalordergraph: arr,
      topCategoiresItemsSoldbyyear,
      overallTopSeller,
      overallprodgraph:overallprod
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const revenuedata = async (req, res) => {
  try {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const orderarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const start_date = moment(req.query.year2).startOf("year").toDate();
    const end_date = moment(req.query.year2).endOf("year").toDate();

    const start_date2 = moment(req.query.year).startOf("year").toDate();
    const end_date2 = moment(req.query.year).endOf("year").toDate();
    const start_date3 = moment(req.query.year3).startOf("year").toDate();
    const end_date3 = moment(req.query.year3).endOf("year").toDate();


    const query6 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date2,
              $lte: end_date2
            },
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
            count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },

        {
          $addFields: {
            month: "$_id",
          }
        },
        // { $unwind: '$orderr' },

        {
          $project: {
            _id: 0,
            month: 1,
            data: 1,
            count: 1,
          }
        },
        // { $unwind: '$data.orderItems' },

      ];

    const query11 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date2,
              $lte: end_date2
            },
          }
        },


        { $unwind: '$orderItems' },
        {
          $group: {
            _id: "$orderItems.product",
            // count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },
        // { $unwind: '$orderr' },


        // { $unwind: '$data.orderItems' },

      ];
    const query22 = [
      {
        $match: {
          createdAt: {
            $gte: start_date3,
            $lte: end_date3
          },
        }
      },
      { $unwind: '$orderItems', },
      {
        $lookup: {
          from: "products",
          localField: 'orderItems.product',
          foreignField: "_id",
          as: "orderItems.product"
        }
      },
      {
        $group: {
          _id: '$orderItems.product.category', topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }

        }
      },
      {
        $addFields: {
          catid: "$orderItems.product.category"
        }
      },

      { $sort: { 'topSeller': -1 } },
    ];
    const query66 =
      [
        {
          $match: {
            createdAt: {
              $gte: start_date,
              $lte: end_date
            },
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
            count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },

        {
          $addFields: {
            month: "$_id",
          }
        },
        // { $unwind: '$orderr' },

        {
          $project: {
            _id: 0,
            month: 1,
            data: 1,
            count: 1,
          }
        },
        // { $unwind: '$data.orderItems' },

      ];
    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date
          },
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
          totalorders: { $sum: 1 }
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
          totalorders: 1
        }
      }
    ];
    const query5 = [
      {
        $match: {
          createdAt: {
            $gte: start_date3,
            $lte: end_date3
          },
        }
      },
      { $unwind: '$orderItems', },
      {
        $group: {
          _id: '$orderItems.name', topSeller: { $sum: '$orderItems.qty' }, netSales: {
            $sum: {
              $multiply: ["$orderItems.qty", "$orderItems.price"]
            }
          }

        }
      },
      { $sort: { 'topSeller': -1 } },
    ];
    const query112 =
      [
    
        {
          $addFields: {
            date: {
              $dayOfYear: "$createdAt"
            }
          }
        },

        {
          $group: {
            _id: "$date",
            count: { $sum: "$totalPrice" },
            data: {
              $push: "$$ROOT"
            },
          }
        },

        {
          $addFields: {
            month: "$_id",
          }
        },
        // { $unwind: '$orderr' },

        {
          $project: {
            _id: 0,
            month: 1,
            data: 1,
            count: 1,
          }
        },
        // { $unwind: '$data.orderItems' },

      ];
    const [overvieworders, allproducts, orderbysalesgraph, salesCount, topCategoiresItemsSoldbyyear, overallTopSeller,revenuebydayOrder] = await Promise.all([
      Order.aggregate(query6),
      Order.aggregate(query11),
      Order.aggregate(query66),
      Order.aggregate(query),
      Order.aggregate(query22),
      Order.aggregate(query5),
      Order.aggregate(query112),

      
    ]);
    console.log('salesCount', salesCount)
    orderbysalesgraph.forEach((data) => {
      if (data) orderarr[data.month - 1] = data.count;
    });
    salesCount.forEach((data) => {
      if (data) arr[data.month - 1] = data.totalorders;
    });
    await res.status(201).json({
      overvieworders,
      allproducts,
      orderbysalesgraph: orderarr,
      orderbysalesgraphdata: orderbysalesgraph,

      totalordergraph: arr,
      topCategoiresItemsSoldbyyear,
      overallTopSeller,
      revenuebydayOrder
    });
  } catch (err) {
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
const savepaymentinfo = async (req, res) => {
  const { cardholdername,
    cardnumber,
    cvvnumber,
    expirydate,
    paymentmethod } = req.body
  console.log('req.body', req.body)
  try {
    const PaymentInfoExists = await PaymentInfo.findOne({ user: req.id })

    if (PaymentInfoExists) {
      PaymentInfoExists.cardholdername = cardholdername
      PaymentInfoExists.cardnumber = cardnumber
      PaymentInfoExists.cvvnumber = cvvnumber
      PaymentInfoExists.expirydate = expirydate
      PaymentInfoExists.paymentmethod = paymentmethod

      await PaymentInfoExists.save()
    }
    else {
      const payment = new PaymentInfo({
        cardholdername,
        cardnumber,
        cvvnumber,
        expirydate,
        paymentmethod,
        user: req.id
      })
      console.log('payment', payment)
      const paymentcreated = await payment.save()
      await User.findByIdAndUpdate({ _id: req.id }, { paymentinfo: payment._id }, { new: true });


      console.log('paymentcreated', paymentcreated)
    }
    const user = await User.findOne({ _id: req.id }).populate('paymentinfo');
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      zipcode: user.zipcode,
      country: user.country,
      city: user.city,
      state: user.state,
      dob: user.dob,
      hearaboutus: user.hearaboutus,
      termsservices: user.termsservices,
      privacypolicy: user.privacypolicy,
      membershipstatus: user.membershipstatus,
      userImage: user.userImage,
      token: generateJWTtoken(user._id),
      createdAt: user.createdAt,
      paymentinfo: user.paymentinfo
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
export {
  addOrderItems,
  ordersummaryrevenue,
  getOrderById,
  updateOrderToPaid,
  orderlogs,
  analysisproducts,
  logs,
  updateOrderToDelivered,
  getCountofallCollection,
  getLatestOrders,
  addGeoGeneticsOrderItems,
  geoGeneticslogs,
  editgeogeneticstext,
  savepaymentinfo,
  overviewdata,
  revenuedata,
  categoriesummary,
  topCategoriestemsSold,
  nogeoorderlogs
};
