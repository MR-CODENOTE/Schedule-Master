import React, { useState } from 'react';

function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState(' ');
  const [password, setPassword] = useState(' '); // Pre-fill for convenience

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm p-8 border border-slate-200 dark:border-slate-700 m-4">
        <h3 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">System Login</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
            <input
              type="text"
              id="loginUsername"
              className="w-full border dark:border-slate-600 rounded px-3 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              id="loginPassword"
              className="w-full border dark:border-slate-600 rounded px-3 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="superadmin0790"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition shadow-lg mt-2"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={onClose} className="text-sm text-slate-500 hover:underline p-2">Cancel / View Only</button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;