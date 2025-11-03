const XeroClient = require("xero-node").XeroClient;

const redirectUris = process.env.XERO_REDIRECT_URI || "http://localhost:5173";
const xeroState = "xero-state";
const client_id = process.env.XERO_CLIENT_ID;
const client_secret = process.env.XERO_CLIENT_SECRET;

const xeroConfig = {
  clientId: client_id,
  clientSecret: client_secret,
  redirectUris: [`${redirectUris}/xero/callback`],
  scopes: process.env.XERO_SCOPES.split(" "),
  state: xeroState,
  httpTimeout: 3000,
};

const xero = new XeroClient(xeroConfig);

module.exports = { redirectUris, xero, xeroConfig, xeroState, client_secret, client_id };
