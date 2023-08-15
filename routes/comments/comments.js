const express = require("express");
const {
  createCommentCtrl,
  fetchSingleCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../../controllers/comments/comments");

const commentsRoutes = express.Router();

// POST /api/v1/comments
commentsRoutes.post("", createCommentCtrl);

// GET /api/v1/comments/:id
commentsRoutes.get("/:id", fetchSingleCommentCtrl);

// DELETE /api/v1/comments/:id
commentsRoutes.delete("/:id", deleteCommentCtrl);

// PUT /api/v1/comments/:id
commentsRoutes.put("/:id", updateCommentCtrl);

module.exports = commentsRoutes;
