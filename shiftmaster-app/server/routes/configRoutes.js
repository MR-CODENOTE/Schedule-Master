const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/authMiddleware');
const logAction = require('../utils/logger');

const router = express.Router();

// --- Roles --- //

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const { data: roles, error } = await supabase
      .from('roles')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

// Add a new role
router.post('/roles', verifyToken, async (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).json({ message: 'Name and color are required.' });
  }

  try {
    const { data: newRole, error } = await supabase
      .from('roles')
      .insert({ name, color })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ message: 'Role with this name already exists.' });
      }
      throw error;
    }

    await logAction(req.user.username, 'Config Changed', `Added role: ${name}`);
    res.status(201).json(newRole);
  } catch (err) {
    console.error('Error adding role:', err);
    res.status(500).json({ message: 'Error adding role' });
  }
});

// Delete a role
router.delete('/roles/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Get role name for logging before deleting
    const { data: roleToDelete, error: fetchError } = await supabase
      .from('roles')
      .select('name')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return res.status(404).json({ message: 'Role not found.' });
      throw fetchError;
    }

    const { error: deleteError } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      if (deleteError.code === '23503') { // Foreign key violation
        return res.status(409).json({ message: 'Cannot delete role that is currently assigned to shifts.' });
      }
      throw deleteError;
    }

    await logAction(req.user.username, 'Config Changed', `Deleted role: ${roleToDelete.name}`);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ message: 'Error deleting role' });
  }
});

// --- Time Slots --- //

// Get all time slots
router.get('/times', verifyToken, async (req, res) => {
  try {
    const { data: timeSlots, error } = await supabase
      .from('time_slots')
      .select('*')
      .order('label', { ascending: true });

    if (error) throw error;
    res.json(timeSlots);
  } catch (err) {
    console.error('Error fetching time slots:', err);
    res.status(500).json({ message: 'Error fetching time slots' });
  }
});

// Add a new time slot
router.post('/times', verifyToken, async (req, res) => {
  const { label, time_range } = req.body;
  if (!label || !time_range) {
    return res.status(400).json({ message: 'Label and time range are required.' });
  }

  try {
    const { data: newTimeSlot, error } = await supabase
      .from('time_slots')
      .insert({ label, time_range })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ message: 'Time slot with this label already exists.' });
      }
      throw error;
    }

    await logAction(req.user.username, 'Config Changed', `Added time slot: ${label}`);
    res.status(201).json(newTimeSlot);
  } catch (err) {
    console.error('Error adding time slot:', err);
    res.status(500).json({ message: 'Error adding time slot' });
  }
});

// Delete a time slot
router.delete('/times/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Get label for logging before deleting
    const { data: timeToDelete, error: fetchError } = await supabase
      .from('time_slots')
      .select('label')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return res.status(404).json({ message: 'Time slot not found.' });
      throw fetchError;
    }

    const { error: deleteError } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', id);

    if (deleteError) {
      if (deleteError.code === '23503') { // Foreign key violation
        return res.status(409).json({ message: 'Cannot delete time slot that is currently assigned to shifts.' });
      }
      throw deleteError;
    }

    await logAction(req.user.username, 'Config Changed', `Deleted time slot: ${timeToDelete.label}`);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting time slot:', err);
    res.status(500).json({ message: 'Error deleting time slot' });
  }
});

module.exports = router;