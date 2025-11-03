const XeroTokenModel = require("../models/xeroTokenModel");

const validateXeroToken = async (req, res, next) => {
  try {
    const token = await XeroTokenModel.getActiveToken();

    if (!token) {
      return res.status(400).json({
        error: "Xero not connected. Admin must complete authentication.",
      });
    }

    req.xeroToken = token;

    next();
  } catch (err) {
    console.error("❌ Xero token validation error:", err.message);
    return res.status(401).json({
      error: "Xero token invalid. Admin must reconnect.",
      message: err.message,
    });
  }
};

module.exports = validateXeroToken;
