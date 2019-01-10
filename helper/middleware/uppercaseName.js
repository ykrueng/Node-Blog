module.exports = (req, res, next) => {
  const { users } = res;
  const Uusers = users.map(user => ({...user, name: user.name.toUpperCase()}));

  res.status(200).json(Uusers);
}