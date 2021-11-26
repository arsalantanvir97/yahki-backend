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

  export {createProduct,getproducts,getProductDetails};
