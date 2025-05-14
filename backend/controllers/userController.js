const User = require('../models/User');
const Store = require('../models/Store');
const pool = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFilteredUsers = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const filters = req.query;
    const users = await User.getFiltered(filters);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.createUser = async (req, res) => {

  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, email, password, address, role } = req.body;

    // Validate inputs
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: 'Name must be between 20 and 60 characters' });
    }
    if (address.length > 400) {
      return res.status(400).json({ error: 'Address must be less than 400 characters' });
    }
    if (password.length < 8 || password.length > 16 || 
        !/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be 8-16 characters with at least one uppercase and one special character' 
      });
    }
    if (!['admin', 'store-owner', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create user
    const userId = await User.create({ name, email, password, address, role });
    
    // If store owner, create a store
    if (role === 'store-owner') {
      await Store.create({
        name: `${name}'s Store`,
        email,
        address,
        ownerId: userId
      });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let response = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    };

    // If store owner, get store rating
    if (user.role === 'store-owner') {
      const store = await Store.getByOwner(user.id);
      if (store) {
        const [rating] = await pool.execute(
          'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?',
          [store.id]
        );
        response.averageRating = rating[0].average_rating || 0;
      }
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};