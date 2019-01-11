const userDb = require("../../data/helpers/userDb");

module.exports = async (req, res, next) => {
  const { postId } = req.params;
  const { user } = req;

  try {
    const posts = await userDb.getUserPosts(user.id);
    if (posts.length === 0) {
      res.status(400).json({
        message: "You don't have any post to modify."
      });
    }
    const validatedPost = posts.find(post => post.id === Number(postId));
    if (!validatedPost) {
      res.status(401).json({
        message: "Cannot find post with this id."
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      message: "Cannot validate ownership."
    });
  }
};
