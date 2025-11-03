const { XeroClient } = require("xero-node");
const { xero, xeroState, client_id, client_secret } = require("../config/xeroConfig");
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

  async ensureValidToken(passedToken) {
    let token = passedToken;

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

      token = await XeroTokenModel.getActiveToken();

      await xero.setTokenSet({
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: token.expires_at,
      });
    }

    return token.tenant_id;
  },

  async getInvoices(params, token) {
    const tenantId = await this.ensureValidToken(token);
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

  async getContacts(params, token) {
    const tenantId = await this.ensureValidToken(token);
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

  async getTaxRates(params, token) {
    const tenantId = await this.ensureValidToken(token);

    const response = await xero.accountingApi.getAccounts(
      tenantId,
      undefined,
      params.where,
      params.order
    );
    return response.body.accounts;
  },

  async getAccounts(params, token) {
    const tenantId = await this.ensureValidToken(token);
    const response = await xero.accountingApi.getAccounts(
      tenantId,
      params.where,
      params.order
    );
    return response.body.accounts;
  },
};

module.exports = XeroService;
