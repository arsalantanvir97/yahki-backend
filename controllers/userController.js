import moment from "moment";
import asyncHandler from "express-async-handler";

import User from "../models/UserModel.js";

const logs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              firstName: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            },
            {
              lastName: {
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
const becomemeber = asyncHandler(async (req, res) => {
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  const user = await User.findById(req.id);
  user.signature = user_image;
    user.ismember = true;


  await user.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    user
  });
});

const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  const user = await User.findOne({email});
  user.firstName = firstName;
  user.lastName = lastName;
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

export {
  logs,
  toggleActiveStatus,
  getUserDetails,
  getLatestUsers,
  becomemeber,

	editProfile
};
