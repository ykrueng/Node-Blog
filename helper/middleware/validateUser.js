const userDb = require("../../data/helpers/userDb");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  console.log('id', id)

  // check for non numeric and null id
  if (isNaN(id)) {
    res.status(400).json({
      message: "Invalid Id"
    });
  }

  try {
    // check for id that's not in database
    const user = await userDb.get(id);
    if (!user) {
      res.status(404).json({
        message: "Cannot find a user with this Id"
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      message: "Cannot validate user Id"
    });
  }
};