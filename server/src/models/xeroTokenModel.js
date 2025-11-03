const pool = require("../config/db");

const XeroTokenModel = {
  async getActiveToken() {
    const [rows] = await pool.query(
      "SELECT * FROM xero_tokens WHERE active = 1 ORDER BY id DESC LIMIT 1"
    );
    return rows[0];
  },

  async saveToken({ accessToken, refreshToken, expiresAt, tenantId }) {
    await pool.query(`UPDATE xero_tokens SET active = 0`);

    await pool.query(
      `INSERT INTO xero_tokens (access_token, refresh_token, expires_at, tenant_id, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
      [accessToken, refreshToken, expiresAt, tenantId]
    );
  },

  async updateToken({ accessToken, refreshToken, expiresAt }) {
    await pool.query(
      `UPDATE xero_tokens 
       SET access_token = ?, refresh_token = ?, expires_at = ?, updated_at = NOW()
       WHERE active = 1`,
      [accessToken, refreshToken, expiresAt]
    );
  },
};

module.exports = XeroTokenModel;
