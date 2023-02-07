import moment from "moment";
import asyncHandler from "express-async-handler";
import WishList from "../models/WishListModel.js";
import generateToken from "../utills/generateJWTtoken.js";

import User from "../models/UserModel.js";
import Order from "../models/OrderModel.js";
import Membership from "../models/MembershipModel.js";

const logs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
      {
        $or: [
          {
            firstname: {
              $regex: `${req.query.searchString}`,
              $options: "i"
            }
          },
          {
            lastname: {
              $regex: `${req.query.searchString}`,
              $options: "i"
            }
          },
          {
            email: {
              $regex: `${req.query.searchString}`,
              $options: "i"
            }
          }
        ]
      }
      : {};
    let sort =
      req.query.sort == "asc"
        ? { createdAt: -1 }
        : req.query.sort == "des"
          ? { createdAt: 1 }
          : { createdAt: 1 };

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

    const user = await User.paginate(
      {
        ...searchParam,
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
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const toggleActiveStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("user", user);
    user.status = user.status == true ? false : true;
    await user.save();
    await res.status(201).json({
      message: user.status ? "User Activated" : "User Deactivated",
    });
  } catch (err) {
    console.log("error", error);
    res.status(500).json({
      message: err.toString(),
    });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().select("-password");
    await res.status(201).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const getLatestUsers = async (req, res) => {
  try {
    const user = await User.find().sort({ $natural: -1 }).limit(5);

    await res.status(201).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  const user = await User.findOne({ email });
  user.firstname = firstName;
  user.lastname = lastName;
  user.email = email;

  user.userImage = user_image ? user_image : user.userImage;
  await user.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    user
  });
});
const getuserordersandwihslist = async (req, res) => {
  try {
    const user = await User.findById(req.id).lean().select("-password");
    const wishListofUser = await WishList.find({ user: req.id }).populate(
      "user product"
    ).lean()
    const orderofUser = await Order.find({ user: req.id }).populate(
      "user"
    ).lean()

    await res.status(201).json({
      user,
      wishListofUser,
      orderofUser
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const becomemeber = async (req, res) => {
  try {
    const { firstname,
      lastname,
      email,
      phone,
      address,
      zipcode,
      country,
      city,
      state,
      password,
      dob,
      hearaboutus,
      termsservices,
      privacypolicy,
      membershipstatus } = req.body
    const UserExists = await User.findOne({ email });
    if (UserExists) {
      res.status(400).json({
        message: err.toString(),
      });
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password,
      address,
      zipcode,
      country,
      city,
      state,
      dob,
      hearaboutus,
      termsservices,
      privacypolicy,
      membershipstatus,
    })
    await user.save()
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
      token: generateToken(user._id),
      createdAt: user.createdAt
    })

  } catch (err) {
    console.log('err',err)
    res.status(500).json({
      message: err.toString(),
    });
  }

}

export {
  logs,
  becomemeber,
  toggleActiveStatus,
  getUserDetails,
  getLatestUsers,
  getuserordersandwihslist,
  editProfile
};
