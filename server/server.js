const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const userDb = require("../data/helpers/userDb");
const postDb = require("../data/helpers/postDb");

const server = express();

// middleware
server.use(cors());
server.use(morgan("short"));
server.use(bodyParser.json());
server.use(helmet());

server.get("/", (req, res) => {
  res.send("Welcome to Node-Blog API");
});

// route handler for GET /api/users
server.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: "please provide an id"
    });
  }

  try {
    const user = await userDb.get(id);
    if (!user) {
      res.status(404).json({
        message: "user does not exist"
      })
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      message: "cannot retrieve user info"
    });
  }
});

// route handler for GET /api/users/:id/post
server.get("/api/users/:id/posts",
  async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "please provide an id"
      });
    }

    try {
      const user = await userDb.get(id);
      if (!user) {
        res.status(404).json({
          message: "user does not exist"
        })
      }
      const posts = await userDb.getUserPosts(id);
      res.status(200).json(posts);
    } catch(err) {
      res.status(500).json({
        message: "cannot retrieve user posts"
      })
    }
});

module.exports = server;
