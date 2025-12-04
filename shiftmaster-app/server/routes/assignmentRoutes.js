const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/authMiddleware');
const logAction = require('../utils/logger');

const router = express.Router();

// Get all assignments for a given period (e.g., a week/month)
router.get('/', async (req, res) => {
  // Optional: Add query parameters for date range if needed for performance
  try {
    const { data: assignments, error } = await supabase
      .from('assignments')
      .select('*, employees(name), roles(name), time_slots(label, time_range)'); // Join with related tables

    if (error) throw error;
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// Create or Update an assignment
router.post('/', verifyToken, async (req, res) => {
  const { employee_id, assignment_date, role_id, time_slot_id } = req.body;

  if (!employee_id || !assignment_date || !role_id) {
    return res.status(400).json({ message: 'Employee ID, assignment date, and role ID are required.' });
  }

  try {
    // Check if an assignment already exists for this employee on this date
    const { data: existingAssignment, error: checkError } = await supabase
      .from('assignments')
      .select('id')
      .eq('employee_id', employee_id)
      .eq('assignment_date', assignment_date)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is 'no rows found'
      throw checkError;
    }

    let result;
    if (existingAssignment) {
      // Update existing assignment
      result = await supabase
        .from('assignments')
        .update({ role_id, time_slot_id, updated_at: new Date().toISOString() })
        .eq('id', existingAssignment.id)
        .select('*, employees(name), roles(name)')
        .single();
      await logAction(req.user.username, 'Shift Updated', `Updated shift for employee ${employee_id} on ${assignment_date} to role ${role_id}`);
    } else {
      // Create new assignment
      result = await supabase
        .from('assignments')
        .insert({ employee_id, assignment_date, role_id, time_slot_id })
        .select('*, employees(name), roles(name)')
        .single();
      await logAction(req.user.username, 'Shift Assigned', `Assigned shift for employee ${employee_id} on ${assignment_date} with role ${role_id}`);
    }

    if (result.error) throw result.error;
    res.status(200).json(result.data);

  } catch (err) {
    console.error('Error creating/updating assignment:', err);
    res.status(500).json({ message: 'Error creating/updating assignment' });
  }
});

// Delete an assignment
router.delete('/:employeeId/:date', verifyToken, async (req, res) => {
  const { employeeId, date } = req.params;

  try {
    // Get info for logging
    const { data: assignmentToDelete, error: fetchError } = await supabase
      .from('assignments')
      .select('employee_id, assignment_date, employees(name), roles(name)')
      .eq('employee_id', employeeId)
      .eq('assignment_date', date)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    if (!assignmentToDelete) return res.status(404).json({ message: 'Assignment not found.' });

    const { error: deleteError } = await supabase
      .from('assignments')
      .delete()
      .eq('employee_id', employeeId)
      .eq('assignment_date', date);

    if (deleteError) throw deleteError;

    await logAction(req.user.username, 'Shift Deleted', `Removed shift for ${assignmentToDelete.employees.name} on ${assignmentToDelete.assignment_date} (Role: ${assignmentToDelete.roles.name})`);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting assignment:', err);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
});

module.exports = router;