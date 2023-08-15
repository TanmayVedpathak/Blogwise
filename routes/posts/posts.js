const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchQueryPostsCtrl,
  fetchSinglePostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const protected = require("../../middlewares/protected");

const postsRoutes = express.Router();

// instance of multer
const upload = multer({
  storage,
});

// POST /api/v1/posts
postsRoutes.post("", protected, upload.single("file"), createPostCtrl);

// GET /api/v1/posts
postsRoutes.get("", fetchPostsCtrl);

// GET /api/v1/posts
postsRoutes.get("/query", fetchQueryPostsCtrl);

// GET /api/v1/posts/:id
postsRoutes.get("/:id", fetchSinglePostCtrl);

// DELETE /api/v1/posts/:id
postsRoutes.delete("/:id", protected, deletePostCtrl);

// PUT /api/v1/posts/:id
postsRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postsRoutes;
