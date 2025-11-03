const UserService = require("../services/userService");

const getUsers = async (req, res) => {
  const users = await UserService.listUsers();
  res.json({ users });
};

const getUser = async (req, res) => {
  const user = await UserService.getUser(req.params.id);
  res.json({ user });
};

module.exports = {
  getUsers,
  getUser,
};