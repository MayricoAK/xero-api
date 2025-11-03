const UserModel = require("../models/userModel");

const UserService = {
  async listUsers() {
    return await UserModel.getAll();
  },

  async getUser(userId) {
    return await UserModel.findById(userId);
  },
};

module.exports = UserService;
