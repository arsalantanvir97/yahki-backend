import WishList from "../models/WishListModel";
import User from "../models/UserModel";

const createWishList = async (req, res) => {
  const { product } = req.body;
  console.log("req.body", req.body);

  try {
    const WishExist = await WishList.findOne({ user: req.id, product });
    
    if (WishExist) {
      return res.status(204).json({ message: "Wish Already Created" });
    }

    const wishList = new WishList({
      user: req.id,
      product
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
        wishListcreated
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const userWishList = async (req, res) => {
  try {
    const wishListofUser = await WishList.find({ user: req.id }).populate(
      "user product"
    );
    console.log("wishListofUser", wishListofUser);
    await res.status(201).json({
      wishListofUser
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteAWish = async (req, res) => {
  try {
    const wishlist = await WishList.findByIdAndRemove(req.params.id);
  
    return res.status(200).json({ message: "Recovery status Accepted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createWishList, userWishList, deleteAWish };
