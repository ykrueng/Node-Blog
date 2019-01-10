const express = require("express");

const configMdlware = require("../config/middleware");
const userDb = require("../data/helpers/userDb");
const postDb = require("../data/helpers/postDb");

const server = express();

const checkUsername = async(req, res, next) => {
  const { name } = req.body;

  if (!name || name.lenght > 30) {
    res.status(400).json({
      message: "please provide a username less than 30 chars"
    });
  }

  try {
    users = await userDb.get();
    const duplicate = users.find(user => user.name.toLowerCase() === name.toLowerCase());
    
    if (duplicate) {
      res.status(400).json({
        message: "username is taken"
      })
    }

    req.name = name
      .split(" ")
      .map(str => `${str[0].toUpperCase()}${str.slice(1)}`)
      .join(" ");
    next();
  } catch (err) {
    res.status(500).json({
      message: "cannot check the username"
    })
  }

};

const upperCase = (req, res, next) => {
  const { users } = res;
  const Uusers = users.map(user => ({...user, name: user.name.toUpperCase()}));

  res.status(200).json(Uusers);
}

const checkUser = async (req, res, next) => {
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
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      message: "cannot retrieve user info"
    });
  }
};

// apply config middleware
configMdlware(server);

server.get("/", (req, res) => {
  res.send("Welcome to Node-Blog API");
});

// route handler for POST /api/users
server.post("/api/users", checkUsername, async (req, res) => {
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
server.get("/api/users", async (req, res, next) => {
  try {
    const users = await userDb.get();
    res.users = users;
    next();
  } catch (err) {
    res.status(500).json({
      message: "cannot retrieve users"
    });
  }
}, upperCase);

// route handler for GET /api/users/:id
server.get("/api/users/:id", checkUser, (req, res) => {
  res.status(200).json(req.user);
});

// route handler for PUT /api/users/:id
server.put("/api/users/:id", checkUser, checkUsername, async (req, res) => {
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
server.delete("/api/users/:id", checkUser, async (req, res) => {
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
server.get("/api/users/:id/posts", checkUser, async (req, res) => {
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
server.post("/api/users/:id/posts", checkUser, async (req, res) => {
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
