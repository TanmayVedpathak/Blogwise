// create comment
const createCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment created",
    });
  } catch (error) {
    res.json(error);
  }
};

// get single comment
const fetchSingleCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment details",
    });
  } catch (error) {
    res.json(error);
  }
};

// delete comment
const deleteCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment deleted",
    });
  } catch (error) {
    res.json(error);
  }
};

// update comment
const updateCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment updated",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createCommentCtrl,
  fetchSingleCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
