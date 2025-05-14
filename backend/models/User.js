const bcrypt = require('bcrypt');
const pool = require('../config/db');

class User {
  static async create({ name, email, password, address, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Safety log
  if (!['admin', 'store-owner', 'user'].includes(role)) {
    console.error('Invalid role passed to User.create:', role);
    throw new Error('Invalid role');
  }

  console.log('Creating user with role:', role);

  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, address, role]
  );
  return result.insertId;
}


  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT id, name, email, address, role FROM users');
    return rows;
  }

  static async getFiltered(filters) {
    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const params = [];

    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      query += ' AND email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      query += ' AND address LIKE ?';
      params.push(`%${filters.address}%`);
    }
    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

module.exports = User;