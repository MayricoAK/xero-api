const XeroService = require("../services/xeroService");

const initiateXeroAuth = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only authorization." });
    }

    const url = await XeroService.generateAuthUrl(req.user.userId);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleXeroCallback = async (req, res) => {
  try {
    const { code } = req.body;
    await XeroService.handleCallback(code);
    res.json({ message: "Xero connected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getXeroInvoices = async (req, res) => {
  try {
    const { where, order, page, pageSize, searchTerm } = req.query;
    const params = {
      where: where || undefined,
      order: order || undefined,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      searchTerm: searchTerm || undefined,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    const data = await XeroService.getInvoices(params, req.xeroToken);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getXeroContacts = async (req, res) => {
  try {
    const { where, order, page, pageSize, searchTerm, contact_name } =
      req.query;

    const params = {
      where: where || undefined,
      order: order || undefined,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      searchTerm: searchTerm || undefined,
      contact_name: contact_name || undefined,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    const contacts = await XeroService.getContacts(params, req.xeroToken);

    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getXeroAccounts = async (req, res) => {
  try {
    const { where, order } = req.query;

    const params = {
      where: where || undefined,
      order: order || undefined,
    };
    const accounts = await XeroService.getAccounts(params, req.xeroToken);

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getXeroTaxRates = async (req, res) => {
  try {
    const { where, order } = req.query;
    const params = {
      where: where || undefined,
      order: order || undefined,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );
    const taxRates = await XeroService.getTaxRates(params, req.xeroToken);

    res.json(taxRates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  initiateXeroAuth,
  handleXeroCallback,
  getXeroInvoices,
  getXeroContacts,
  getXeroAccounts,
  getXeroTaxRates,
};
