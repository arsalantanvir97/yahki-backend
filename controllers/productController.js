import Product from "../models/ProductModel";

const createProduct = async (req, res) => {
  const {
    id,
    name,
    price,
    brand,
    weight,
    category,
    countInStock,
    description,
  } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  try {
    const product = new Product({
      admin: id,
      name,
      price,
      brand,
      weight,
      category,
      countInStock,
      description,
      productimage: user_image,
    });
    console.log("product", product);
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const productcreated = await product.save();
    console.log("productcreated", productcreated);
    if (productcreated) {
      res.status(201).json({
        productcreated,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
const getproducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log("products", products);
    if (products) {
      res.status(201).json({
        products,
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await res.status(201).json({
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const detoxProducts = async (req, res) => {
  console.log("req.body.category", req.body.category);
  try {
    const detoxproduct = await Product.find({ category: req.body.category });
    console.log("detoxproduct", detoxproduct);
    await res.status(201).json({
      detoxproduct,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const productlogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            { name: { $regex: `${req.query.searchString}`, $options: "i" } },
          ],
        }
      : {};

    const status_filter = req.query.status ? { status: req.query.status } : {};
    const category_filter = req.query.category
      ? { category: req.query.category }
      : {};

    // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day"),
        }, // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };
    // const lowprice=req.query.lowerprice ? { "$sort": { "price": 1 } } : {};

    let sort =
      req.query.sort == "asc"
        ? { price: 1 }
        : req.query.sort == "des"
        ? { price: -1 }
        : req.query.sort == "latest"
        ? "createdAt"
        : req.query.sort == "nameasc"
        ? { name: 1 }
        : req.query.sort == "namedes"
        ? { name: -1 }
        : "createdAt";

    // console.log('lowprice',lowprice)
    console.log("sort", sort);
    const pricefrom = req.query.pricefrom;
    const priceto = req.query.priceto;
    let pricerange = {};
    if (pricefrom && priceto)
      pricerange = {
        price: {
          $gte: pricefrom,
          $lte: priceto,
        }, // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };

    // console.log("req.params.id", req.params.id);
    const product = await Product.paginate(
      {
        ...pricerange,
        // ...latestfilter,
        ...category_filter,
        ...searchParam,
        ...status_filter,
        ...dateFilter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort,
      }
    );
    await res.status(200).json({
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};
const productbycategorylogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            { name: { $regex: `${req.query.searchString}`, $options: "i" } },
          ],
        }
      : {};

    const status_filter = req.query.status ? { status: req.query.status } : {};

    // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day"),
        }, // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };
    // const lowprice=req.query.lowerprice ? { "$sort": { "price": 1 } } : {};

    let sort =
      req.query.sort == "asc"
        ? { price: 1 }
        : req.query.sort == "des"
        ? { price: -1 }
        : req.query.sort == "latest"
        ? "createdAt"
        : req.query.sort == "nameasc"
        ? { name: 1 }
        : req.query.sort == "namedes"
        ? { name: -1 }
        : "createdAt";

    // console.log('lowprice',lowprice)
    console.log("sort", sort);
    const pricefrom = req.query.pricefrom;
    const priceto = req.query.priceto;
    let pricerange = {};
    if (pricefrom && priceto)
      pricerange = {
        price: {
          $gte: pricefrom,
          $lte: priceto,
        }, // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };

    // console.log("req.params.id", req.params.id);
    const product = await Product.paginate(
      {
        category: req.params.id,
        ...pricerange,
        // ...latestfilter,
        ...searchParam,
        ...status_filter,
        ...dateFilter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort,
      }
    );
    await res.status(200).json({
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const getlimitedProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ $natural: -1 }).limit(5);

    console.log("products", products);
    if (products) {
      res.status(201).json({
        products,
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

export {
  createProduct,
  getproducts,
  getProductDetails,
  detoxProducts,
  productlogs,
  productbycategorylogs,
  getlimitedProducts,
};
