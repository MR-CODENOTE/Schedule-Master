const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/authMiddleware');
const logAction = require('../utils/logger');

const router = express.Router();

// Get all employees (accessible to authenticated users)
router.get('/', async (req, res) => {
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Add a new employee (accessible to authenticated users)
router.post('/', verifyToken, async (req, res) => {
  const { name, responsibility, contact, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required.' });
  }

  try {
    const { data: newEmployee, error } = await supabase
      .from('employees')
      .insert({ name, responsibility, contact, type })
      .select()
      .single();

    if (error) throw error;

    await logAction(req.user.username, 'Employee Added', `Added employee: ${name} (${type})`);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ message: 'Error adding employee' });
  }
});

// Delete an employee (accessible to authenticated users)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Get employee name for logging before deleting
    const { data: employeeToDelete, error: fetchError } = await supabase
      .from('employees')
      .select('name')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return res.status(404).json({ message: 'Employee not found.' });
      throw fetchError;
    }

    const { error: deleteError } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    await logAction(req.user.username, 'Employee Removed', `Removed employee: ${employeeToDelete.name}`);
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

module.exports = router;