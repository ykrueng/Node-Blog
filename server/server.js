const express = require("express");

const configMdlware = require("../config/middleware");
const validateName = require("../helper/middleware/validateName");
const validateUser = require("../helper/middleware/validateUser");

const userDb = require("../data/helpers/userDb");
const postDb = require("../data/helpers/postDb");

const server = express();

// apply config middleware
configMdlware(server);

server.get("/", (req, res) => {
  res.send("Welcome to Node-Blog API");
});

// route handler for POST /api/users
server.post("/api/users", validateName, async (req, res) => {
  try {
    const newId = await userDb.insert({ name: req.name });
    res.status(201).json(newId);
  } catch (err) {
    res.status(500).json({
      message: "cannot create new user"
    });
  }
});

// route handler for GET /api/users
server.get("/api/users", async (req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "cannot retrieve users"
    });
  }
});

// route handler for GET /api/users/:id
server.get("/api/users/:id", validateUser, (req, res) => {
  res.status(200).json(req.user);
});

// route handler for PUT /api/users/:id
server.put("/api/users/:id", validateUser, validateName, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await userDb.update(id, { name: req.name });
    if (count === 1) {
      res.sendStatus(204);
    }
    res.status(500).json({ message: "failed to update user's info" });
  } catch (err) {
    res.status(500).json({
      message: "cannot update user's info"
    });
  }
});

// route handler for DELETE /api/users/:id
server.delete("/api/users/:id", validateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const count = await userDb.remove(id);
    if (count === 1) {
      res.sendStatus(204);
    }
    res.status(500).json({ message: "failed to remove user" });
  } catch (err) {
    res.status(500).json({
      message: "cannot remove user"
    });
  }
});

// route handler for GET /api/users/:id/posts
server.get("/api/users/:id/posts", validateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await userDb.getUserPosts(id);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "cannot retrieve user's posts"
    });
  }
});

// route handler for GET /api/posts
server.get("/api/posts", async (req, res) => {
  try {
    const posts = await postDb.get();
    res.status(200).json(posts);
  } catch {
    res.status(500).json({
      message: "cannot fetch posts"
    });
  }
});

// route handler for GET /api/posts/:id
server.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;

  if (Number.isNaN(id)) res.status(400).json({
    message: "please provide the post id"
  })

  try {
    const post = await postDb(id);
    if (post.length !== 1) {
      res.status(400).json({
        message: "post does not exist"
      })
    }
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json({
      message: "cannot fetch the post"
    })
  }
})

// route handler for POST /api/users/:id/posts
server.post("/api/users/:id/posts", validateUser, async (req, res) => {
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

module.exports = server;
