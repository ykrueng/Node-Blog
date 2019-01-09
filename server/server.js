const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const userDb = require("../data/helpers/userDb");
const postDb = require("../data/helpers/postDb");

const server = express();

const checkUser = async(req, res, next) => {
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
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      message: "cannot retrieve user info"
    });
  }
}

// middleware
server.use(cors());
server.use(morgan("short"));
server.use(bodyParser.json());
server.use(helmet());

server.get("/", (req, res) => {
  res.send("Welcome to Node-Blog API");
});

// route handler for GET /api/users
server.get("/api/users", async(req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "cannot retrieve users"
    });
  }
})

// route handler for GET /api/users/:id
server.get("/api/users/:id", checkUser, (req, res) => {
    res.status(200).json(req.user);
});

// route handler for GET /api/users/:id/post
server.get("/api/users/:id/posts", checkUser,
  async (req, res) => {
    const { id } = req.params;
    try {
      const posts = await userDb.getUserPosts(id);
      res.status(200).json(posts);
    } catch(err) {
      res.status(500).json({
        message: "cannot retrieve user's posts"
      })
    }
});

module.exports = server;
