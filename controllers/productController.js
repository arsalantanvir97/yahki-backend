import Mongoose from "mongoose";
import Category from "../models/CategoryModel";
import Order from "../models/OrderModel";
import Product from "../models/ProductModel";

const createProduct = async (req, res) => {
  const { category, name, price, description, id, visible, countInStock } =
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
      visible,
      description,
      countInStock: countInStock,
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
const getProductDetailsByName = async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.id }).populate(
      "category"
    );
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
    const detoxcategory = await Category.findOne({ categorytitle: "Detox" });

    const detoxproduct = await Product.find({ category: detoxcategory._id });
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
const geoGeneticsProducts = async (req, res) => {
  console.log("req.body.category", req.body.category);
  try {
    const geoGeneticscategory = await Category.findOne({
      categorytitle: "Geo'Genetics"
    });

    const geoGeneticsproduct = await Product.find({
      category: geoGeneticscategory._id
    });
    console.log("geoGeneticsproduct", geoGeneticsproduct);
    await res.status(201).json({
      geoGeneticsproduct
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
      console.log("req.params.category", req.params.category);
      cat_filter = {
        category: Mongoose.mongo.ObjectId(req.query.category)
      };
    }
    const product = await Product.paginate(
      {
        ...cat_filter,

        ...pricerange,
        // ...latestfilter,
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
    console.log("req.query.geogeneticscategory", req.query.geogeneticscategory);

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
        category: {
          $ne: Mongoose.mongo.ObjectId(req.query.geogeneticscategory)
        },
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
const geoGeneticslogs = async (req, res) => {
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
    console.log("req.params.id", req.query.id);
    // console.log("req.params.id", req.params.id);
    const product = await Product.paginate(
      {
        category: Mongoose.mongo.ObjectId(req.query.id),

        ...pricerange,
        // ...latestfilter,
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
    const products = await Product.find({ visible: true })
      .sort({ $natural: -1 })
      .limit(5);

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
    const product = await Product.findOne({ _id: req.params.id });
    console.log("block1");
    const cat = await Category.findOne({ _id: product.category });
    console.log("block2");
    await Product.findByIdAndRemove(req.params.id);
    console.log("block3");

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
      visible,
      category,
      description,
      images,
      countInStock
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
    const product = await Product.findOne({ _id: id });
    product.name = name ? name : product.name;
    product.price = price ? price : product.price;
    product.countInStock = countInStock ? countInStock : product.countInStock;
    product.visible = visible ? visible : product.visible;
    product.category = category ? category : product.category;

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
const getproductsbycategoryid = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id });
    console.log("products", products);

    res.status(201).json({
      products
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const productsbycategoryid = async (req, res) => {
  console.log("req.params.id", req.query);
  try {
    const products = await Product.find({
      category: { $eq: req.query.id },
      _id: { $ne: req.query.productid }
    })
      .populate("category")
      .limit(6);
    console.log("products", products);

    res.status(201).json({
      products
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const searchProductlogs = async (req, res) => {
  const { searchString } = req.body;
  console.log("req.body", searchString, typeof searchString);
  try {
    const abc = await Order.aggregate([
      {
        $match: { "orderItems.name": { $regex: searchString, $options: "i" } }
      },
      {
        $group: {
          _id: "$shippingAddress.shippingstate",

          // orders: { $first: "$$CURRENT" },
          // total: { $multiply: [ "$price", "$quantity" ] },
          count: { $sum: "$totalPrice" },
          groupedata: {
            $push: {
              order: "$orderItems",
              _id: "$_id",
              taxperproduct: "$taxperproduct",
              totalPrice: "$totalPrice",
              shippingAddress: "$shippingAddress",
              taxPrice: "$taxPrice"
            }
          }
        }
      }
    ]);
    console.log("abc", abc);
    let productbystate = [];
    abc.length > 0 &&
      abc.map((abcc) => {
        let productbystatee = [];
        abcc.groupedata.map((gr) =>
          gr.order.map((ord) => {
            console.log("productbystateeproductbystatee", productbystatee);
            const found = productbystatee.find((e) => e.ord.name === ord.name);
            console.log("found", found);
            if (found) {
              console.log("insideblock");
              productbystatee = productbystatee.map((prodddd) => {
                if (prodddd.ord.name == ord.name)
                  prodddd.ord.qty = prodddd.ord.qty + ord.qty;
                return prodddd;
              });
            } else {
              ord.name.toLowerCase().includes(searchString.toLowerCase()) &&
                productbystatee.push({ ord, state: abcc._id });
            }
          })
        );
        productbystate.push([...productbystatee]);
      });
    console.log("productbystate", productbystate);
    await res.status(200).json({
      abc,
      productbystate
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
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
  searchProductlogs,
  productlogsofAdmin,
  toggleActiveStatus,
  editProduct,
  getproductsbycategoryid,
  geoGeneticslogs,
  productsbycategoryid,
  getProductDetailsByName,
  geoGeneticsProducts
};
