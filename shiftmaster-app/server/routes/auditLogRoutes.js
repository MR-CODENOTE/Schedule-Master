const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken, authorizeAdmin } = require('../middleware/authMiddleware');
const logAction = require('../utils/logger');

const router = express.Router();

// Get audit logs (accessible to all authenticated users)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data: logs, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false }); // Latest first

    if (error) throw error;
    res.json(logs);
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});

// Clear all audit logs (Admin only)
router.delete('/', verifyToken, authorizeAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows (dummy condition)
      // Supabase RLS can handle full table delete based on service_role for this route if needed.

    if (error) throw error;

    await logAction(req.user.username, 'Audit Log Cleared', 'All audit logs cleared by admin');
    res.status(204).send();
  } catch (err) {
    console.error('Error clearing audit logs:', err);
    res.status(500).json({ message: 'Error clearing audit logs' });
  }
});

module.exports = router;