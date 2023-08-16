const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// create post
const createPostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      next(appErr("All fields are required"));
    }
    // find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    // create the post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });

    // push the post created into the array of users posts
    userFound.posts.push(postCreated._id);

    // re save the user
    userFound.save();

    res.json({
      status: "success",
      message: "Post created",
      data: postCreated,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// get posts
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const postsList = await Post.find().populate("comments");

    if (!postsList) {
      return next(appErr("Posts not found"));
    }

    res.json({
      status: "success",
      message: "Posts List",
      data: postsList,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// get posts based on query
const fetchQueryPostsCtrl = async (req, res, next) => {
  try {
    const postsList = await Post.find({
      category: req.query.category,
    }).populate("comments");

    if (!postsList) {
      return next(appErr("Posts not found"));
    }

    res.json({
      status: "success",
      message: "Posts List",
      data: postsList,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// get single post
const fetchSinglePostCtrl = async (req, res, next) => {
  try {
    // get hte id from params
    const id = req.params.id;

    // find the post
    const post = await Post.findById(id).populate("comments");

    if (!post) {
      return next(appErr("Post not found"));
    }

    res.json({
      status: "success",
      message: "Post details",
      data: post,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// delete post
const deletePostCtrl = async (req, res, next) => {
  try {
    // find the post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(appErr("Post not found"));
    }

    // check if post belongs to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this post", 403));
    }

    // delete post from user
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userAuth.toString(),
      {
        $pull: { posts: post._id },
      },
      {
        new: true,
      }
    );

    // delete post comments from user
    await User.deleteMany({ comments: { $in: post.comments } });

    // delete post comments from comment
    await Comment.deleteMany({ _id: { $in: post.comments } });

    // delete post
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      message: "Post deleted",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// update post
const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(appErr("Post not found"));
    }

    // check if post belongs to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to update this post", 403));
    }

    // update
    const postUpdated = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        image: req.file.path,
      },
      {
        new: true,
      }
    );

    res.json({
      status: "success",
      message: "Post updated",
      data: postUpdated,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchQueryPostsCtrl,
  fetchSinglePostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
