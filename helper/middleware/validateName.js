const userDb = require("../../data/helpers/userDb");

module.exports = async (req, res, next) => {
  const { name } = req.body;

  // check for empty name && name that's longer than 30 chars
  if (!name || name.lenght > 30) {
    res.status(400).json({
      message: "Please provide a username that is less than 30 chars."
    });
  }

  try {
    // check for username that is already in use
    users = await userDb.get();
    const duplicate = users.find(user => user.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      res.status(400).json({
        message: "Sorry, this username is taken."
      })
    }

    // capitalize the first letter of each name and attached it to req
    req.name = name
      .split(" ")
      .map(strName => `${strName[0].toUpperCase()}${strName.slice(1).toLowerCase()}`)
      .join(" ");
    next();
  } catch (err) {
    res.status(500).json({
      message: "cannot check the username"
    })
  }
};