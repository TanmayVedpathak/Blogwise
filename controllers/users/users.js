const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  // check if field is empty
  if (!fullname || !email || !password) {
    // return next(appErr("All fields are required"));
    return res.render("users/register", {
      error: "All fields are required",
    });
  }
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      // return next(appErr("user already exist"));
      return res.render("users/register", {
        error: "User already exist",
      });
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
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    // redirect to profilr
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    next(appErr(error.message));
  }
};

//   login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body; // check if field is empty
  if (!email || !password) {
    // return next(appErr("All fields are required"));
    return res.render("users/login", {
      error: "All fields are required",
    });
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      // return next(appErr("invaild credentials"));
      return res.render("users/login", {
        error: "Invalid Credentials",
      });
    }
    // verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      // return next(appErr("invaild credentials"));
      return res.render("users/login", {
        error: "Invalid Credentials",
      });
    }

    // save user into session
    req.session.userAuth = userFound._id;
    // res.json({
    //   status: "success",
    //   data: userFound,
    // });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    next(appErr(error.message));
  }
};

// logout
const logoutCtrl = async (req, res, next) => {
  try {
    // destroy session
    req.session.destroy();
    // res.json({
    //   status: "success",
    //   user: "User logout",
    // });
    res.redirect("/api/v1/users/login");
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
    const user = await User.findById(userId)
      .populate("posts")
      .populate("comments");
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/profile", { user });
  } catch (error) {
    next(appErr(error.message));
  }
};

// profile img upload
const profileImgUploadCtrl = async (req, res, next) => {
  try {
    // check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user not found
    if (!userFound) {
      // return next(appErr("user not found", 403));
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
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
    // res.json({
    //   status: "success",
    //   data: updatedUser,
    // });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    // next(appErr(error.message));
    res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

// cover img upload
const coverImgUploadCtrl = async (req, res, next) => {
  try {
    // check if file exist
    if (!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error: "Please upload image",
      });
    }
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user not found
    if (!userFound) {
      // return next(appErr("user not found", 403));
      return res.render("users/uploadCoverPhoto", {
        error: "User not found",
      });
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
    // res.json({
    //   status: "success",
    //   data: updatedUser,
    // });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    // next(appErr(error.message));
    res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

// user details
const userDetailsCtrl = async (req, res, next) => {
  try {
    // get userId fro params
    const userId = req.params.id;
    // find the user
    const user = await User.findById(userId);
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/updateUser", {
      error: "",
      user,
    });
  } catch (error) {
    // next(appErr(error.message));
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "All fields are required",
        user: "",
      });
    }
    //Check if email is not taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken._id.toString()  !== req.session.userAuth.toString() ) {
        // return next(appErr("Email is taken", 400));
        return res.render("users/updateUser", {
          error: "Email is taken",
          user: "",
        });
      }
    }
    //update the user
    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    // return next(appErr(error.message));
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};

// update password
const passwordCtrl = async (req, res, next) => {
  const { prevPassword, newPassword } = req.body;
  if (!prevPassword || !newPassword) {
    return res.render("users/updatePassword", {
      error: "Please provide all field",
      user: "",
    });
  }
  try {
    // check if prev password is same 
    const user = await User.findById(req.session.userAuth)
    const isPasswordValid = await bcrypt.compare(prevPassword, user.password)

    if(!isPasswordValid){
      return res.render("users/updatePassword", {
        error: "Invalid Credentials",
        user: "",
      });
    }

    // check if prev password is  not same as new password
    
    // check if user is updating the password
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // udate user
      const updatedUser = await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );

      // res.json({
      //   status: "success",
      //   message: "User password updated",
      //   data: updatedUser,
      // });
      res.redirect("/api/v1/users/profile-page");
    }
  } catch (error) {
    // return next(appErr("please provide password feild"));
    return res.render("users/updatePassword", {
      error: error.message,
      user: "",
    });
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
