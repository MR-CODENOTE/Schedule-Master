const express = require('express');
const { hashPassword } = require('../utils/password');
const supabase = require('../config/supabase');
const { verifyToken, authorizeAdmin } = require('../middleware/authMiddleware');
const logAction = require('../utils/logger');

const router = express.Router();

// Get all users (Admin only, exclude built-in admin for deletion purposes)
router.get('/', verifyToken, authorizeAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, role')
      .order('username', { ascending: true });

    if (error) throw error;

    // Add built-in admin for display, but mark as undeletable
    const builtInAdmin = {
      id: 'admin_builtin',
      username: process.env.ADMIN_USERNAME,
      role: 'admin',
      isBuiltIn: true
    };
    res.json([builtInAdmin, ...users]);

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Create a new user (Admin only)
router.post('/', verifyToken, authorizeAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }
  if (role !== 'admin' && role !== 'editor') {
    return res.status(400).json({ message: 'Role must be "admin" or "editor".' });
  }
  // Prevent creating a user with the built-in admin username
  if (username === process.env.ADMIN_USERNAME) {
    return res.status(409).json({ message: 'Cannot create a user with the built-in admin username.' });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ username, password: hashedPassword, role })
      .select('id, username, role')
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ message: 'Username already exists.' });
      }
      throw error;
    }

    await logAction(req.user.username, 'User Created', `Created user: ${username} (${role})`);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Delete a user (Admin only, prevent deleting built-in admin)
router.delete('/:id', verifyToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  // Prevent deletion of the built-in admin
  if (id === 'admin_builtin') {
    return res.status(403).json({ message: 'The built-in admin account cannot be deleted.' });
  }

  try {
    // Get username for logging before deletion
    const { data: userToDelete, error: fetchError } = await supabase
      .from('users')
      .select('username')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return res.status(404).json({ message: 'User not found.' });
      throw fetchError;
    }

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    await logAction(req.user.username, 'User Deleted', `Deleted user: ${userToDelete.username}`);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;