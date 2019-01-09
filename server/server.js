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
server.use(helmet())

server.get("/", (req, res) => {
  res.send("Welcome to Node-Blog API");
});

// route to GET /api/users
server.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: 'please provide an id'
    })
  }

  try {
    const user = await userDb.get(id);

    if (user) {
      res.status(200).json({user})
    }

  } catch (err) {
    res.status(500).json({
      message: 'cannot retrieve user info'
    })
  }

})

module.exports = server;
