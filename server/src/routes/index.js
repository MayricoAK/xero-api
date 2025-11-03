const express = require("express");
const authRoute = require("./authRoutes");
const userRoute = require("./userRoutes");
const xeroRoute = require("./xeroRoutes");

const Router = express.Router();

Router.use("/auth", authRoute);
Router.use("/user", userRoute);
Router.use("/xero", xeroRoute);

module.exports = Router;
