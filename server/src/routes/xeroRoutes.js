const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const validateXeroToken = require("../middlewares/validateXeroToken");
const {
  initiateXeroAuth,
  handleXeroCallback,
  getXeroInvoices,
  getXeroContacts,
  getXeroAccounts,
  getXeroTaxRates,
} = require("../controllers/xeroController");
const { XeroCallbackSchema, PaginationQuerySchema } = require("../schemas/xeroSchema");
const { validateBody, validateQuery } = require("../middlewares/validateSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/auth", initiateXeroAuth);
router.post("/callback", validateBody(XeroCallbackSchema), handleXeroCallback);

router.get("/invoices", validateQuery(PaginationQuerySchema), validateXeroToken, getXeroInvoices);
router.get("/contacts", validateQuery(PaginationQuerySchema), validateXeroToken, getXeroContacts);
router.get("/accounts", validateXeroToken, getXeroAccounts);
router.get("/tax-rates", validateXeroToken, getXeroTaxRates);

module.exports = router;
