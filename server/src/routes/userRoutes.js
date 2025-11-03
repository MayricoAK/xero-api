const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getUsers, getUser } = require("../controllers/userController");
const router = express.Router();

router.use(authenticateToken);

router.get("/", getUsers);
router.get("/:id", getUser);

module.exports = router;
