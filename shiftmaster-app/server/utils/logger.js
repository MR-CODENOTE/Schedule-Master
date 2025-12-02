const supabase = require('../config/supabase');

const logAction = async (actor_username, action_type, details) => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        actor_username,
        action_type,
        details
      });

    if (error) {
      console.error('Error logging action to Supabase:', error);
    } else {
      // console.log('Action logged successfully:', data);
    }
  } catch (err) {
    console.error('Exception during logging:', err);
  }
};

module.exports = logAction;