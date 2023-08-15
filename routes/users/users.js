const express = require("express");
const multer = require("multer");
const {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  userDetailsCtrl,
  profileCtrl,
  profileImgUploadCtrl,
  coverImgUploadCtrl,
  passwordCtrl,
  updateUserCtrl,
} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");

const userRoutes = express.Router();

// instance of multer
const upload = multer({ storage });

// POST /api/v1/users/register
userRoutes.post("/register", registerCtrl);

// POST /api/v1/users/login
userRoutes.post("/login", loginCtrl);

// GET /api/v1/users/logout
userRoutes.get("/logout", protected, logoutCtrl);

// GET /api/v1/users/profile
userRoutes.get("/profile", protected, profileCtrl);

// PUT /api/v1/users/profile-image-upload
userRoutes.put(
  "/profile-image-upload",
  protected,
  upload.single("profile"),
  profileImgUploadCtrl
);

// PUT /api/v1/users/cover-image-upload
userRoutes.put(
  "/cover-image-upload",
  protected,
  upload.single("cover"),
  coverImgUploadCtrl
);

// PUT /api/v1/users/update-password/:id
userRoutes.put("/update-password/:id", passwordCtrl);

//PUT/api/v1/users/update/:id
userRoutes.put("/update/:id", updateUserCtrl);

// GET /api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

module.exports = userRoutes;
