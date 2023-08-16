const User = require("../../model/user/User");
const Post = require("../../model/post/Post");
const Comment = require("../../model/comment/Comment");
const appErr = require("../../utils/appErr");

// create comment
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    const postId = req.params.id;
    const userId = req.session.userAuth;
    // find the post
    const post = await Post.findById(postId);
    // find the user
    const user = await User.findById(userId);
    // create the comment
    const comment = await Comment.create({
      message,
      user: userId,
      post: post._id,
    });
    // push the comment to the post
    post.comments.push(comment._id);
    // push the comment to the user
    user.comments.push(comment._id);
    // disable validation
    // save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.json({
      status: "success",
      message: "Comment created",
      data: comment,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// get single comment
const fetchSingleCommentCtrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("Comment not found"));
    }
    res.json({
      status: "success",
      message: "Comment details",
      data: comment,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// delete comment
const deleteCommentCtrl = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    // find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(appErr("Comment not found"));
    }

    // check if comment belongs to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this comment", 403));
    }

    // delete comment from post
    const updatedPost = await Post.findByIdAndUpdate(
      comment.post.toString(),
      {
        $pull: { comments: commentId },
      },
      { new: true }
    );

    // delete comment from user
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userAuth.toString(),
      {
        $pull: { comments: commentId },
      },
      { new: true }
    );

    // delete comment
    await Comment.findByIdAndDelete(commentId);
    res.json({
      status: "success",
      message: "Comment deleted",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// update comment
const updateCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find the comment
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(appErr("Comment not found"));
    }

    // check if comment belongs to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this comment", 403));
    }

    // update
    const commentUpdated = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "Comment updated",
      data: commentUpdated,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createCommentCtrl,
  fetchSingleCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
