// create post
const createPostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post created",
    });
  } catch (error) {
    res.json(error);
  }
};

// get posts
const fetchPostsCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Posts List",
    });
  } catch (error) {
    res.json(error);
  }
};

// get single post
const fetchSinglePostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post details",
    });
  } catch (error) {
    res.json(error);
  }
};

// delete post
const deletePostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post deleted",
    });
  } catch (error) {
    res.json(error);
  }
};

// update post
const updatePostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post updated",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchSinglePostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
