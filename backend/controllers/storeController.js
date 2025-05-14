const Store = require('../models/Store');
const User = require('../models/User');
const pool = require('../config/db');

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.getAll();
    const storesWithUserRating = await Promise.all(stores.map(async store => {
      if (req.session.user) {
        const userRating = await Store.getUserRating(store.id, req.session.user.id);
        return { ...store, userRating };
      }
      return store;
    }));
    res.json(storesWithUserRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFilteredStores = async (req, res) => {
  try {
    const filters = req.query;
    const stores = await Store.getFiltered(filters);
    const storesWithUserRating = await Promise.all(stores.map(async store => {
      if (req.session.user) {
        const userRating = await Store.getUserRating(store.id, req.session.user.id);
        return { ...store, userRating };
      }
      return store;
    }));
    res.json(storesWithUserRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createStore = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, email, address, ownerId } = req.body;
    const storeId = await Store.create({ name, email, address, ownerId });
    res.status(201).json({ message: 'Store created successfully', storeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.submitRating = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { storeId, rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const averageRating = await Store.submitRating(storeId, req.session.user.id, rating);
    res.json({ message: 'Rating submitted successfully', averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStoreRatings = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user is store owner
    const store = await Store.getByOwner(req.session.user.id);
    if (!store) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const ratings = await Store.getRatings(store.id);
    res.json({ ratings, averageRating: store.average_rating || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [storesCount] = await pool.execute('SELECT COUNT(*) as count FROM stores');
    const [ratingsCount] = await pool.execute('SELECT COUNT(*) as count FROM ratings');

    res.json({
      usersCount: usersCount[0].count,
      storesCount: storesCount[0].count,
      ratingsCount: ratingsCount[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};