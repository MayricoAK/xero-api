const pool = require("../config/db");

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND active = 1 LIMIT 1",
      [email]
    );
    return rows[0];
  },

  async findById(userId) {
    const [rows] = await pool.query(
      "SELECT userid, name, email, phone, role, active FROM users WHERE userid = ? LIMIT 1",
      [userId]
    );
    return rows[0];
  },

  async create(userData) {
    const { name, email, password, phone, role, enteredBy } = userData;

    const [result] = await pool.query(
      `INSERT INTO users 
      (name, email, password, phone, role, enteredby, entereddate, active)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)`,
      [name, email, password, phone, role, enteredBy]
    );

    return result.insertId;
  },

  async getAll() {
    const [rows] = await pool.query(
      `SELECT userid, name, email, phone, role, active 
       FROM users ORDER BY userid DESC`
    );
    return rows;
  },

  async update(userId, data) {
    const fields = [];
    const values = [];

    Object.entries(data).forEach(([key, val]) => {
      fields.push(`${key} = ?`);
      values.push(val);
    });

    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(", ")}, editeddate = NOW() WHERE userid = ?`;

    await pool.query(sql, values);
    return true;
  },

  async softDelete(userId) {
    await pool.query(
      "UPDATE users SET active = 0, editeddate = NOW() WHERE userid = ?",
      [userId]
    );
    return true;
  },
};

module.exports = UserModel;
