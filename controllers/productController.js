import Product from "../models/ProductModel";

const createProduct = async (req, res) => {
    const { id,name,
        price,
        brand,
        weight,
        category,
        countInStock,
        description } = req.body;
    let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
    try {
      const product =new Product ({
          admin:id,
        name,
        price,
        brand,
        weight,
        category,
        countInStock,
        description,
        productimage:user_image
        }
      )
      console.log('product',product)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const productcreated=await product.save()
    console.log('productcreated',productcreated)
      if (productcreated) {
        res.status(201).json({
            productcreated
        });
    } }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const getproducts  = async (req, res) => {
  
    try {
        const products=await Product.find()
        console.log('products',products)
        if (products) {
         res.status(201).json({
            products
         });}
      }catch (err) {
          console.log('err',err)
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
    try {
      const detoxproduct = await Product.find({category:'Detox'})
      console.log('detoxproduct',detoxproduct)
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
            $lte: moment.utc(new Date(to)).endOf("day"),
          },
        };
  
      console.log("req.params.id", req.params.id);
      const product = await Product.paginate(
        {
          ...searchParam,
          ...status_filter,
          ...dateFilter,
        },
        {
          page: req.query.page,
          limit: req.query.perPage,
          lean: true,
          sort: "-_id",
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
  
  export {createProduct,getproducts,getProductDetails,detoxProducts,productlogs};
