import React, { useState, useEffect } from 'react';
import { to12Hour } from '../utils/helper';

function ConfigModal({
  isOpen,
  onClose,
  roles,
  timeSlots,
  onAddRole,
  onDeleteRole,
  onAddTimeSlot,
  onDeleteTimeSlot,
}) {
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#3b82f6');
  const [newTimeLabel, setNewTimeLabel] = useState('');
  const [newTimeStart, setNewTimeStart] = useState('');
  const [newTimeEnd, setNewTimeEnd] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset form fields when modal closes
      setNewRoleName('');
      setNewRoleColor('#3b82f6');
      setNewTimeLabel('');
      setNewTimeStart('');
      setNewTimeEnd('');
    }
  }, [isOpen]);

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      onAddRole(newRoleName, newRoleColor);
      setNewRoleName('');
    } else {
      alert('Role name cannot be empty.');
    }
  };

  const handleAddTime = () => {
    if (newTimeLabel.trim()) {
      onAddTimeSlot(newTimeLabel, newTimeStart, newTimeEnd);
      setNewTimeLabel('');
      setNewTimeStart('');
      setNewTimeEnd('');
    } else {
      alert('Time slot label cannot be empty.');
    F}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700 m-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Configuration</h3>

        <div className="mb-6">
          <h4 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase mb-2">Manage Roles</h4>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              id="newRoleName"
              placeholder="Role Name (e.g. Opening)"
              className="flex-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded px-3 py-2 text-sm dark:text-white"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="color"
                id="newRoleColor"
                value={newRoleColor}
                onChange={(e) => setNewRoleColor(e.target.value)}
                className="h-9 w-12 rounded cursor-pointer border p-0 dark:border-slate-600 bg-transparent"
              />
              <button
                onClick={handleAddRole}
                className="bg-slate-800 dark:bg-slate-700 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 dark:hover:bg-slate-600 flex-1 sm:flex-none"
              >
                Add
              </button>
            </div>
          </div>
          <ul className="space-y-1 max-h-40 overflow-y-auto border dark:border-slate-700 rounded p-2 bg-slate-50 dark:bg-slate-950/50">
            {roles.length === 0 ? (
              <li className="text-center text-slate-500 text-sm py-2">No roles defined.</li>
            ) : (
              roles.map((r) => (
                <li key={r.id} className="flex justify-between items-center text-sm p-1 border-b dark:border-slate-800 last:border-0 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: r.color }}></div> {r.name}</div>
                  <button onClick={() => onDeleteRole(r.id, r.name)} className="text-red-400 hover:text-red-600"><i className="fa-solid fa-times"></i></button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase mb-2">Manage Times (AM/PM)</h4>
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              id="newTimeLabel"
              placeholder="Label (e.g. Morning)"
              className="w-full bg-white dark:bg-slate-800 border dark:border-slate-600 rounded px-3 py-2 text-sm dark:text-white"
              value={newTimeLabel}
              onChange={(e) => setNewTimeLabel(e.target.value)}
            />
            <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
              <span className="text-xs text-slate-400">From:</span>
              <input
                type="time"
                id="newTimeStart"
                className="bg-white dark:bg-slate-800 border dark:border-slate-600 rounded px-2 py-1.5 text-sm dark:text-white flex-grow"
                value={newTimeStart}
                onChange={(e) => setNewTimeStart(e.target.value)}
              />
              <span className="text-xs text-slate-400">To:</span>
              <input
                type="time"
                id="newTimeEnd"
                className="bg-white dark:bg-slate-800 border dark:border-slate-600 rounded px-2 py-1.5 text-sm dark:text-white flex-grow"
                value={newTimeEnd}
                onChange={(e) => setNewTimeEnd(e.target.value)}
              />
              <button
                onClick={handleAddTime}
                className="w-full sm:w-auto bg-slate-800 dark:bg-slate-700 text-white px-3 py-1.5 rounded text-sm hover:bg-slate-700 dark:hover:bg-slate-600"
              >
                Add
              </button>
            </div>
          </div>
          <ul className="space-y-1 max-h-40 overflow-y-auto border dark:border-slate-700 rounded p-2 bg-slate-50 dark:bg-slate-950/50">
            {timeSlots.length === 0 ? (
              <li className="text-center text-slate-500 text-sm py-2">No time slots defined.</li>
            ) : (
              timeSlots.map((t) => (
                <li key={t.id} className="flex justify-between items-center text-sm p-1 border-b dark:border-slate-800 last:border-0 text-slate-800 dark:text-slate-200">
                  <div><span className="font-semibold">{t.label}</span> <span className="text-xs text-gray-500 dark:text-gray-400">{t.time_range}</span></div>
                  <button onClick={() => onDeleteTimeSlot(t.id, t.label)} className="text-red-400 hover:text-red-600"><i className="fa-solid fa-times"></i></button>
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

export default ConfigModal;