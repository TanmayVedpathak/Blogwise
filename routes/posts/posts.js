const express = require("express");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchSinglePostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");

const postsRoutes = express.Router();

// POST /api/v1/posts
postsRoutes.post("", createPostCtrl);

// GET /api/v1/posts
postsRoutes.get("", fetchPostsCtrl);

// GET /api/v1/posts/:id
postsRoutes.get("/:id", fetchSinglePostCtrl);

// DELETE /api/v1/posts/:id
postsRoutes.delete("/:id", deletePostCtrl);

// PUT /api/v1/posts/:id
postsRoutes.put("/:id", updatePostCtrl);

module.exports = postsRoutes;
