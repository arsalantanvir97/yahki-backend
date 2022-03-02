import WishList from "../models/WishListModel";

const createWishList = async (req, res) => {
  const {
    id,
    name,
    user_image,
    price,
    brand,
    weight,
    category,
    countInStock,
    description,
  } = req.body;
  console.log("req.body", req.body);

  console.log("block1", user_image);
  try {
    const WishExist = await WishList.findOne({  name:name,user:id});
    if (WishExist) {
        return res.status(201).json({ message: "Wish Already Created" });
      }
    
    const wishList = new WishList({
      user: id,
      name,
      price,
      brand,
      weight,
      category,
      countInStock,
      description,
      productimage: user_image,
    });
    console.log("wishList", wishList);
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const wishListcreated = await wishList.save();
    console.log("wishListcreated", wishListcreated);
    if (wishListcreated) {
      res.status(201).json({
        wishListcreated,
      });
    }
  } catch (err) {
    console.log('err',err)
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const userWishList = async (req, res) => {
  const { id } = req.body;
  try {
    const wishListofUser = await WishList.find({ user: id });
    console.log("wishListofUser", wishListofUser);
    await res.status(201).json({
      wishListofUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
const deleteAWish = async (req, res) => {
  try {
    const wishlist = await WishList.findByIdAndRemove(req.params.id);
    return res.status(200).json({ message: "Recovery status Accepted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

export { createWishList, userWishList, deleteAWish };
