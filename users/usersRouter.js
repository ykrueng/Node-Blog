const express = require("express");

const validateName = require("../helper/middleware/validateName");
const validateUser = require("../helper/middleware/validateUser");
const userDb = require("../data/helpers/userDb");
const userPostsRoute = require("../posts/userPostsRouter");

const router = express.Router();

router.post("/", validateName, async (req, res) => {
  try {
    const newId = await userDb.insert({ name: req.name });
    res.status(201).json(newId);
  } catch (err) {
    res.status(500).json({
      message: "Cannot create a new user"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Cannot retrieve users"
    });
  }
});

router.use("/", userPostsRoute);

router.get("/:id", validateUser, (req, res) => {
  res.status(200).json(req.user);
});

router.put("/:id", validateUser, validateName, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await userDb.update(id, { name: req.name });
    if (count === 1) {
      res.sendStatus(204);
    }
    res.status(500).json({ message: "Failed to update user's info" });
  } catch (err) {
    res.status(500).json({
      message: "Cannot update user's info"
    });
  }
});

router.delete("/:id", validateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const count = await userDb.remove(id);
    if (count === 1) {
      res.sendStatus(204);
    }
    res.status(500).json({ message: "Failed to remove user" });
  } catch (err) {
    res.status(500).json({
      message: "Cannot remove user"
    });
  }
});


module.exports = router;
