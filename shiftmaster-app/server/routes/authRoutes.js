const express = require('express');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');
const supabase = require('../config/supabase');
const logAction = require('../utils/logger');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check for built-in admin account first
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { id: 'admin_builtin', username: username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    await logAction(username, 'Login', 'Built-in admin logged in');
    return res.json({ token, user: { username: username, role: 'admin' } });
  }

  try {
    // Check database users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, password, role')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
      throw error;
    }

    if (!users) {
      await logAction(username, 'Login Attempt Failed', 'User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordIsValid = await comparePassword(password, users.password);

    if (!passwordIsValid) {
      await logAction(username, 'Login Attempt Failed', 'Incorrect password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: users.id, username: users.username, role: users.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    await logAction(username, 'Login', 'User logged in');
    res.json({ token, user: { username: users.username, role: users.role } });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;