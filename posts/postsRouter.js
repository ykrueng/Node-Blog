const express = require("express");

const postDb = require("../data/helpers/postDb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await postDb.get();
    res.status(200).json(posts.map(post => ({id: post.id, text: post.text})));
  } catch {
    res.status(500).json({
      message: "Cannot fetch posts."
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id))
    res.status(400).json({
      message: "Invalid post id."
    });

  try {
    const post = await postDb.get(id);
    if (!post) {
      res.status(400).json({
        message: "Cannot find post with this id."
      });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message: "Cannot fetch post."
    });
  }
});

module.exports = router;
