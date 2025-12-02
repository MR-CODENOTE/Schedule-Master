import React, { useState, useEffect } from 'react';

function UserManagementModal({
  isOpen,
  onClose,
  users,
  onAddUser,
  onDeleteUser,
  onRefreshUsers,
}) {
  const [newUserName, setNewUserName] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState('editor');

  useEffect(() => {
    if (isOpen) {
      onRefreshUsers(); // Refresh users every time modal opens
    } else {
      // Reset form fields when modal closes
      setNewUserName('');
      setNewUserPass('');
      setNewUserRole('editor');
    }
  }, [isOpen, onRefreshUsers]);

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserPass.trim()) {
      alert('Username and Password are required.');
      return;
    }
    onAddUser(newUserName, newUserPass, newUserRole);
    setNewUserName('');
    setNewUserPass('');
    setNewUserRole('editor');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700 m-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">User Management</h3>

        <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h4 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase mb-2">Create New Account</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              id="newUserName"
              placeholder="Username"
              className="border dark:border-slate-600 rounded px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <input
              type="password"
              id="newUserPass"
              placeholder="Password"
              className="border dark:border-slate-600 rounded px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              value={newUserPass}
              onChange={(e) => setNewUserPass(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              id="newUserRole"
              className="flex-1 border dark:border-slate-600 rounded px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <option value="editor">Editor (Schedule Only)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
            <button
              onClick={handleAddUser}
              className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-500 font-medium w-full sm:w-auto"
            >
              Create User
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase mb-2">Existing Users</h4>
          <ul className="space-y-2">
            {users.length === 0 ? (
              <li className="text-center text-slate-500 text-sm py-2">No users found.</li>
            ) : (
              users.map((u) => (
                <li key={u.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded border dark:border-slate-700">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{u.username}</span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded ml-2 text-slate-600 dark:text-slate-300 uppercase">{u.role}</span>
                  </div>
                  {u.isBuiltIn ? (
                    <span className="text-xs text-slate-400 italic px-2">Main</span>
                  ) : (
                    <button onClick={() => onDeleteUser(u.id, u.username)} className="text-red-500 hover:text-red-700 text-xs px-2"><i className="fa-solid fa-trash"></i></button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserManagementModal;