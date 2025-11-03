const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { generateAuthToken } = require("../utils/tokenUtils");

const registerUser = async (userData) => {
  const { name, email, password, phone, role = "admin" } = userData;
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role
  });

  return {
    userid: userId,
    name,
    email,
    phone,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateAuthToken({
    userId: user.userid,
    userName: user.name,
    email: user.email,
    role: user.role
  });

  return {
    token,
    user: {
      userid: user.userid,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
