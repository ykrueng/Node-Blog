const express = require("express");

const configMdlware = require("../config/middleware");
const usersRouter = require('../users/usersRouter');
const postsRouter = require('../posts/postsRouter');

const server = express();
configMdlware(server);

server.get("/", (req, res) => {
  res.send("Welcome to Node-Blog API");
});

server.use('/api/users', usersRouter);
server.use('/api/posts', postsRouter);

module.exports = server;
