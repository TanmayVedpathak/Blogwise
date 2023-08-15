const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  // check if field is empty
  if (!fullname || !email || !password) {
    return next(appErr("All fields are required"));
  }
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(appErr("user already exist"));
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // register user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//   login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body; // check if field is empty
  if (!email || !password) {
    return next(appErr("All fields are required"));
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return next(appErr("invaild credentials"));
    }
    // verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      return next(appErr("invaild credentials"));
    }

    // save user into session
    req.session.userAuth = userFound._id;
    res.json({
      status: "success",
      data: userFound,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// logout
const logoutCtrl = async (req, res, next) => {
  try {
    req.session.destroy();
    res.json({
      status: "success",
      user: "User logout",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// user details
const userDetailsCtrl = async (req, res, next) => {
  try {
    // get userId fro params
    const userId = req.params.id;
    // find the user
    const user = await User.findById(userId);
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// profile
const profileCtrl = async (req, res, next) => {
  try {
    //  get the login user
    const userId = req.session.userAuth;
    // find the user
    const user = await User.findById(userId);
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// profile img upload
const profileImgUploadCtrl = async (req, res, next) => {
  try {
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user not found
    if (!userFound) {
      return next(appErr("user not found", 403));
    }

    // update profile image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// cover img upload
const coverImgUploadCtrl = async (req, res, next) => {
  try {
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user not found
    if (!userFound) {
      return next(appErr("user not found", 403));
    }

    // update profile image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    //Check if email is not taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appErr("Email is taken", 400));
      }
    }
    //update the user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// update password
const passwordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    // check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // udate user
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );

      res.json({
        status: "success",
        message: "User password updated",
        data: updatedUser,
      });
    }
  } catch (error) {
    return next(appErr("please provide password feild"));
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  userDetailsCtrl,
  profileCtrl,
  profileImgUploadCtrl,
  coverImgUploadCtrl,
  updateUserCtrl,
  passwordCtrl,
};
