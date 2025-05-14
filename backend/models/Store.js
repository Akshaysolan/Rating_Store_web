const pool = require('../config/db');

class Store {
  static async create({ name, email, address, ownerId }) {
    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT s.*, AVG(r.rating) as average_rating 
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
    return rows;
  }

  static async getFiltered(filters) {
    let query = `
      SELECT s.*, AVG(r.rating) as average_rating 
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    query += ' GROUP BY s.id';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM stores WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByOwner(ownerId) {
    const [rows] = await pool.execute('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
    return rows[0];
  }

  static async getRatings(storeId) {
    const [rows] = await pool.execute(`
      SELECT r.*, u.name as user_name 
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `, [storeId]);
    return rows;
  }

  static async submitRating(storeId, userId, rating) {
    // Check if user already rated this store
    const [existing] = await pool.execute(
      'SELECT * FROM ratings WHERE store_id = ? AND user_id = ?',
      [storeId, userId]
    );

    if (existing.length > 0) {
      await pool.execute(
        'UPDATE ratings SET rating = ? WHERE store_id = ? AND user_id = ?',
        [rating, storeId, userId]
      );
    } else {
      await pool.execute(
        'INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?)',
        [storeId, userId, rating]
      );
    }

    // Return updated average rating
    const [result] = await pool.execute(
      'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?',
      [storeId]
    );
    return result[0].average_rating;
  }

  static async getUserRating(storeId, userId) {
    const [rows] = await pool.execute(
      'SELECT rating FROM ratings WHERE store_id = ? AND user_id = ?',
      [storeId, userId]
    );
    return rows.length > 0 ? rows[0].rating : null;
  }

  static async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM stores');
    return rows[0].count;
  }
}

module.exports = Store;