import React, { useState } from 'react';

function AddEmployeeForm({ onAddEmployee }) {
  const [name, setName] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState('FT');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !responsibility || !contact) {
      alert('All fields are required!');
      return;
    }
    onAddEmployee({ name, responsibility, contact, type });
    setName('');
    setResponsibility('');
    setContact('');
    setType('FT');
  };

  return (
    <div id="addEmployeeSection" className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 protected-feature">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><i className="fa-solid fa-user-plus"></i></div>
        Add Employee
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 items-end">
        <div className="sm:col-span-1 md:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
          <input
            type="text"
            id="empName"
            required
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="sm:col-span-1 md:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Responsibility</label>
          <input
            type="text"
            id="empRole"
            required
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
            placeholder="e.g. Manager"
            value={responsibility}
            onChange={(e) => setResponsibility(e.target.value)}
          />
        </div>
        <div className="sm:col-span-1 md:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Contact</label>
          <input
            type="text"
            id="empContact"
            required
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
            placeholder="e.g. 555-0123"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className="sm:col-span-1 md:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Type</label>
          <select
            id="empType"
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white text-sm"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="FT">Full Time</option>
            <option value="PT">Part Time</option>
          </select>
        </div>
        <button
          type="submit"
          className="sm:col-span-2 md:col-span-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded transition w-full shadow-lg shadow-emerald-900/10 text-sm"
        >
          Add to List
        </button>
      </form>
    </div>
  );
}

export default AddEmployeeForm;