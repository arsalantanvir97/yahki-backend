import Category from "../models/CategoryModel";
import Product from "../models/ProductModel";

const createProduct = async (req, res) => {
  const { category, name, price, status, description, quantityrange, id } =
    req.body;
  let _reciepts = [];
  const reciepts = [];
  _reciepts = req.files.reciepts;
  if (!Array.isArray(_reciepts)) throw new Error("Reciepts Required");
  _reciepts.forEach((img) => reciepts.push(img.path));
  try {
    const product = new Product({
      admin: id,
      name,
      price: Number(price),
      category,
      description,
      status: status,
      pricerange: JSON.parse(quantityrange),
      productimage: reciepts
    });
    console.log("product", product);
    if (product) {
      const cat = await Category.findOne({ _id: category });
      cat.coursecount = cat.coursecount + 1;
      const updatedcat = cat.save();
      //   const feedbackcreated = await Feedback.create(
      //     feedback
      //   );
      //   console.log('feedbackcreated',feedbackcreated)
      const productcreated = await product.save();
      console.log("productcreated", productcreated);

      res.status(201).json({
        productcreated
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getproducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log("products", products);
    if (products) {
      res.status(201).json({
        products
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    await res.status(201).json({
      product
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const detoxProducts = async (req, res) => {
  console.log("req.body.category", req.body.category);
  try {
    const detoxproduct = await Product.find({ category: req.body.category });
    console.log("detoxproduct", detoxproduct);
    await res.status(201).json({
      detoxproduct
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
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
            { name: { $regex: `${req.query.searchString}`, $options: "i" } }
          ]
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
          $lte: moment.utc(new Date(to)).endOf("day")
        } // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
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
          $lte: priceto
        } // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };

    // console.log("req.params.id", req.params.id);
    const product = await Product.paginate(
      {
        ...pricerange,
        // ...latestfilter,
        ...category_filter,
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
      product
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const productlogsofAdmin = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            { name: { $regex: `${req.query.searchString}`, $options: "i" } }
          ]
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
          $lte: moment.utc(new Date(to)).endOf("day")
        } // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };
    // const lowprice=req.query.lowerprice ? { "$sort": { "price": 1 } } : {};

    let sort =
      req.query.sort == "asc"
        ? { createdAt: -1 }
        : req.query.sort == "des"
        ? { createdAt: 1 }
        : { createdAt: 1 };

    // console.log('lowprice',lowprice)
    console.log("sort", sort);
    const pricefrom = req.query.pricefrom;
    const priceto = req.query.priceto;
    let pricerange = {};
    if (pricefrom && priceto)
      pricerange = {
        price: {
          $gte: pricefrom,
          $lte: priceto
        } // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };

    // console.log("req.params.id", req.params.id);
    const product = await Product.paginate(
      {
        ...pricerange,
        // ...latestfilter,
        ...category_filter,
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort,
        populate: "category"
      }
    );
    await res.status(200).json({
      product
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
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
            { name: { $regex: `${req.query.searchString}`, $options: "i" } }
          ]
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
          $lte: moment.utc(new Date(to)).endOf("day")
        } // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
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
          $lte: priceto
        } // const latestfilter=req.query.latestfilter ? { createdAt: req.query.latestfilter } : {};
      };
    let cat_filter = {};
    if (req.query.category) {
      cat_filter = {
        category: Mongoose.mongo.ObjectId(req.query.category)
      };
    }
    // console.log("req.params.id", req.params.id);
    const product = await Product.paginate(
      {
        category: req.params.id,
        ...pricerange,
        ...cat_filter,
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
      product
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getlimitedProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ $natural: -1 }).limit(5);

    console.log("products", products);
    if (products) {
      res.status(201).json({
        products
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const toggleActiveStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("product", product);
    product.status = product.status == true ? false : true;
    console.log("product", product);

    await product.save();
    console.log("service2", product);

    await res.status(201).json({
      message: product.status ? "Product Activated" : "Product Deactivated"
    });
  } catch (err) {
    console.log("error", err);

    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    const product = await Product.findOne({ _id: req.params.id });
    const cat = await Category.findOne({ _id: product.category });
    cat.coursecount = cat.coursecount - 1;
    await cat.save();
    return res.status(201).json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const editProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      price,
      status,
      category,
      description,
      quantityrange,
      images
    } = req.body;
    let _reciepts = [];
    const reciepts = [];
    console.log("images111", images, typeof images);
    let imagge = JSON.parse(images);
    console.log("imageeeeeess", imagge);
    _reciepts = req.files.reciepts;
    console.log("req.bopdy", req.body);
    console.log("block1");
    _reciepts && _reciepts.forEach((img) => reciepts.push(img.path));
    console.log("receiptsss", _reciepts);
    imagge &&
      imagge.map((imgg) => {
        console.log("imgg", imgg);
        reciepts.push(imgg);
      });
    console.log("block2", reciepts);
    console.log(quantityrange ? "yes" : "no");
    const product = await Product.findOne({ _id: id });
    product.name = name ? name : product.name;
    product.price = price ? price : product.price;
    product.status = status ? status : product.status;
    product.category = category ? category : product.category;
    product.pricerange = quantityrange
      ? JSON.parse(quantityrange)
      : product.pricerange;
    product.description = description ? description : product.description;

    product.productimage =
      reciepts.length > 0 ? reciepts : product.productimage;

    await product.save();

    await res.status(201).json({
      product
    });
  } catch (error) {
    console.log("errior", error);
    res.status(500).json({
      message: error.toString()
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
  deleteProduct,
  getlimitedProducts,
  productlogsofAdmin,
  toggleActiveStatus,
  editProduct
};
