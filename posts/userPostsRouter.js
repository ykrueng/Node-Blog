const express = require("express");

const validateUser = require("../helper/middleware/validateUser");
const validatePostAuthor = require("../helper/middleware/validatePostAuthor");
const userDb = require("../data/helpers/userDb");
const postDb = require("../data/helpers/postDb");

const router = express.Router();

router.get("/:id/posts", validateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await userDb.getUserPosts(id);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Cannot retrieve user's posts"
    });
  }
});

router.post("/:id/posts", validateUser, async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  if (!text) {
    res.status(400).json({
      message: 'please provide post text only'
    })
  }

  try {
    const newId = await postDb.insert({ userId: Number(id), text });
    if (newId) {
      res.status(200).json(newId);
    }
    res.status(400).json(newId);
  } catch (err) {
    res.status(500).json({
      message: 'failed to create a new post'
    })
  }
})

router.put("/:id/posts/:postId", validateUser, validatePostAuthor, async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  if (!text) {
    res.status(400).json({
      message: 'please provide post text only'
    })
  }

  try {
    const updateStatus = await postDb.update(postId,{ text });
    if (updateStatus !== 1) {
      res.status(400).json({
        message: "Cannot update posts."
      })
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      message: 'failed to update post'
    })
  }
})

router.delete("/:id/posts/:postId", validateUser, validatePostAuthor, async (req, res) => {
  const { postId } = req.params;

  try {
    const deletePost = await postDb.remove(postId);
    if (deletePost !== 1) {
      res.status(400).json({
        message: "Cannot delete post."
      })
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete post.'
    })
  }
})

module.exports = router;