const { XeroClient } = require("xero-node");
const { xero, xeroState } = require("../config/xeroConfig");
const XeroTokenModel = require("../models/xeroTokenModel");

const XeroService = {
  async generateAuthUrl() {
    const url = await xero.buildConsentUrl();
    return url;
  },

  async handleCallback(code) {
    const callbackUrl = `${process.env.XERO_REDIRECT_URI}/xero/callback?code=${code}&state=${xeroState}`;
    const tokenSet = await xero.apiCallback(callbackUrl);

    const connections = await xero.updateTenants();
    const tenantId = connections[0]?.tenantId;

    await XeroTokenModel.saveToken({
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
      expiresAt: new Date(Date.now() + tokenSet.expires_in * 1000),
      tenantId,
    });

    return true;
  },

  async ensureValidToken2() {
    const token = await XeroTokenModel.getActiveToken();
    if (!token) throw new Error("Xero not connected.");

    const now = new Date();
    const expiresAt = new Date(token.expires_at);

    if (expiresAt <= now) {
      console.log("🔁 Xero access token expired — refreshing...");
      const newXero = new XeroClient();
      const newToken = await newXero.refreshWithRefreshToken(client_id, client_secret, token.refresh_token);

      await XeroTokenModel.updateToken({
        accessToken: newToken.access_token,
        refreshToken: newToken.refresh_token,
        expiresAt: new Date(Date.now() + newToken.expires_in * 1000),
      });

      console.log("✅ Xero token refreshed");
    }

    return (await XeroTokenModel.getActiveToken()).tenant_id;
  },

  async ensureValidToken() {
    const token = await XeroTokenModel.getActiveToken();
    if (!token) throw new Error("Xero not connected.");

    const now = new Date();
    const expiresAt = new Date(token.expires_at);

    await xero.setTokenSet({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: token.expires_at,
    });

    if (expiresAt <= now) {
      console.log("🔁 Xero token expired — refreshing...");

      const newXero = new XeroClient();
      const newToken = await newXero.refreshWithRefreshToken(
        client_id,
        client_secret,
        token.refresh_token
      );

      await XeroTokenModel.updateToken({
        accessToken: newToken.access_token,
        refreshToken: newToken.refresh_token,
        expiresAt: new Date(Date.now() + newToken.expires_in * 1000),
      });

      console.log("✅ Xero token refreshed");

      // Re-set updated token to client
      await xero.setTokenSet({
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token,
        expires_at: new Date(Date.now() + newToken.expires_in * 1000),
      });
    }

    const updated = await XeroTokenModel.getActiveToken();
    return updated.tenant_id;
  },

  async getInvoices(params) {
    const tenantId = await this.ensureValidToken();
    const response = await xero.accountingApi.getInvoices(
      tenantId,
      undefined,
      params.where,
      params.order,
      undefined,
      params.invoiceNumbers,
      params.contactIds,
      params.statuses,
      params.page,
      undefined,
      undefined,
      undefined,
      undefined,
      params.pageSize,
      params.searchTerm
    );
    if (params.page && params.pageSize) {
      return {
        pagination: response.body.pagination || null,
        data: response.body.invoices,
        message: "Invoices synced successfully",
      }
    } else {
      return response.body.invoices
    }
  },

  async getContacts(params) {
    const tenantId = await this.ensureValidToken();
    const response = await xero.accountingApi.getContacts(
      tenantId,
      undefined,
      params.where,
      params.order,
      undefined,
      params.page,
      undefined,
      undefined,
      params.searchTerm,
      params.pageSize
    );
    if (params.page && params.pageSize) {
      return {
        pagination: response.body.pagination || null,
        data: response.body.contacts,
        message: "Contacts synced successfully",
      }
    } else {
      return response.body.contacts
    }
  },

  async getAccounts(params) {
    const tenantId = await this.ensureValidToken();

    const response = await xero.accountingApi.getAccounts(
      tenantId,
      undefined,
      params.where,
      params.order
    );
    return response.body.accounts;
  },

  async getTaxRates(params) {
    const tenantId = await this.ensureValidToken();
    const response = await xero.accountingApi.getTaxRates(
      tenantId,
      params.where,
      params.order
    );
    return response.body.taxRates;
  },
};

module.exports = XeroService;
