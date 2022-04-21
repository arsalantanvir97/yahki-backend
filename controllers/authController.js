import asyncHandler from "express-async-handler";
import Mongoose from "mongoose";

import Admin from "../models/AdminModel.js";
import Reset from "../models/ResetModel.js";
import User from "../models/UserModel.js";

import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";
import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";
import CreateNotification from "../utills/notification.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const AdminExists = await Admin.findOne({ email });

  if (AdminExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,

      token: generateToken(admin._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const authAdmin = asyncHandler(async (req, res) => {
  console.log("authAdmin");
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      userImage: admin.userImage,

      token: generateToken(admin._id)
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});
const adminRecoverPassword = asyncHandler(async (req, res) => {
  console.log("recoverPassword");
  const { email } = req.body;
  console.log("req.body", req.body);
  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.log("!admin");
    return res.status(401).json({
      message: "Invalid Email or Password"
    });
  } else {
    const status = generateCode();
    await createResetToken(email, status);

    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        \n\n Your verification status is ${status}:\n\n
        \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
        </p>`;
    await generateEmail(email, "Yakhi - Password Reset", html);
    return res.status(201).json({
      message:
        "Recovery status Has Been Emailed To Your Registered Email Address"
    });
  }
});

const recoverPassword = asyncHandler(async (req, res) => {
  console.log("recoverPassword");
  const { email } = req.body;
  console.log("req.body", req.body);
  const user = await User.findOne({ email });
  if (!user) {
    console.log("!user");
    return res.status(401).json({
      message: "Invalid Email or Password"
    });
  } else {
    const status = generateCode();
    await createResetToken(email, status);

    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        \n\n Your verification status is ${status}:\n\n
        \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
        </p>`;
    await generateEmail(email, "Yakhi - Password Reset", html);
    return res.status(201).json({
      message:
        "Recovery status Has Been Emailed To Your Registered Email Address"
    });
  }
});

const adminverifyRecoverCode = async (req, res) => {
  const { code, email } = req.body;
  console.log("req.body", req.body);
  const reset = await Reset.findOne({ email, code });

  if (reset)
    return res.status(200).json({ message: "Recovery status Accepted" });
  else {
    return res.status(400).json({ message: "Invalid Code" });
  }
  // console.log("reset", reset);
};
const verifyRecoverCode = async (req, res) => {
  const { code, email } = req.body;
  console.log("req.body", req.body);
  const reset = await Reset.findOne({ email, code });

  if (reset)
    return res.status(200).json({ message: "Recovery status Accepted" });
  else {
    return res.status(400).json({ message: "Invalid Code" });
  }
  // console.log("reset", reset);
};
const adminresetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { password, confirm_password, code, email } = req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirm_password))
      return res.status(400).json({ message: "Password does not match" });
    const reset = await Reset.findOne({ email, code });
    console.log("reset", reset);
    if (!reset)
      return res.status(400).json({ message: "Invalid Recovery status" });
    else {
      console.log("resetexist");
      const updatedadmin = await Admin.findOne({ email });
      updatedadmin.password = password;
      await updatedadmin.save();
      console.log("updatedadmin", updatedadmin);
      res.status(201).json({
        _id: updatedadmin._id,
        firstName: updatedadmin.firstName,
        lastName: updatedadmin.lastName,
        email: updatedadmin.email,
        userImage: updatedadmin.userImage,

        token: generateToken(updatedadmin._id)
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
};

const resetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { password, confirm_password, code, email } = req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirm_password))
      return res.status(400).json({ message: "Password does not match" });
    const reset = await Reset.findOne({ email, code });
    console.log("reset", reset);
    if (!reset)
      return res.status(400).json({ message: "Invalid Recovery status" });
    else {
      console.log("resetexist");
      const updateduser = await User.findOne({ email });
      updateduser.password = password;
      await updateduser.save();
      console.log("updatedadmin", updateduser);
      res.status(201).json({
        _id: updateduser._id,
        firstName: updateduser.firstName,

        email: updateduser.email,
        token: generateToken(updateduser._id)
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
};

const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  const admin = await Admin.findOne({ email });
  admin.firstName = firstName;
  admin.lastName = lastName;
  admin.email = email;

  admin.userImage = user_image ? user_image : admin.userImage;
  await admin.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    _id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    userImage: admin.userImage,
    token: generateToken(admin._id)
  });
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, email, password, confirmpassword } = req.body;
  if (!comparePassword(password, confirmpassword))
    return res.status(400).json({ message: "Password does not match" });

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    email,
    password,
    type: "User"
  });
  console.log("user", user);
  if (user) {
    const notification = {
      notifiableId: null,
      notificationType: "Admin",
      title: `User Created`,
      body: `A user just registered on our app by name of ${firstName}`,
      payload: {
        type: "USER",
        id: user._id
      }
    };
    CreateNotification(notification);

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const authUser = asyncHandler(async (req, res) => {
  console.log("authAdmin");
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,

      email: user.email,
      userImage: user.userImage,

      token: generateToken(user._id)
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});

const emailLogin = asyncHandler(async (req, res) => {
  console.log("authAdmin");
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,

      email: user.email,
      userImage: user.userImage,

      token: generateToken(user._id)
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});

const verifyAndREsetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { existingpassword, newpassword, confirm_password, email } = req.body;

    console.log("req.body", req.body);
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(existingpassword))) {
      console.log("block1");
      if (!comparePassword(newpassword, confirm_password)) {
        console.log("block2");
        return res.status(400).json({ message: "Password does not match" });
      } else {
        console.log("block3");
        admin.password = newpassword;
        await admin.save();
        console.log("admin", admin);
        res.status(201).json({
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          userImage: admin.userImage,

          token: generateToken(admin._id)
        });
      }
    } else {
      console.log("block4");

      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
};

const registerUserbyAdmin = asyncHandler(async (req, res) => {
  const { password, email, confirmpassword, firstName, lastName } = req.body;

  if (!comparePassword(password, confirmpassword))
    return res.status(400).json({ message: "Password does not match" });

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    type: "Admin"
  });
  console.log("user", user);
  if (user) {
    res.status(201).json({
      user
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const registerAdminbyAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  const AdminExists = await Admin.findOne({ email });

  if (AdminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email
  });

  if (admin) {
    res.status(201).json({
      admin
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const adminlogs = async (req, res) => {
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
    const adminfilter = { _id: { $ne: req.id } };
    const admin = await Admin.paginate(
      {
        ...adminfilter,
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
      admin
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const adminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .lean()
      .select("-password");
    await res.status(201).json({
      admin
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteAdmin = async (req, res) => {
  try {
    console.log("deleteFeedback", req.params.id);
    const admin = await Admin.findByIdAndRemove(req.params.id);
    return res.status(200).json({ message: "Admin deleted" });
  } catch (err) {
    console.log('err',err)
    res.status(500).json({
      message: err.toString()
    });
  }
};
export {
  registerAdmin,
  deleteAdmin,
  authAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  registerUser,
  authUser,
  adminRecoverPassword,
  verifyAndREsetPassword,
  adminverifyRecoverCode,
  adminresetPassword,
  registerUserbyAdmin,
  emailLogin,
  registerAdminbyAdmin,
  adminlogs,
  adminDetails
};
