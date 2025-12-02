import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import * as api from '../api/api';

function AssignShiftModal({
  isOpen,
  onClose,
  selectedCell,
  roles,
  timeSlots,
  onSave,
  onDelete,
}) {
  const { currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (isOpen && selectedCell) {
      // Fetch current assignment for the cell if it exists
      const fetchCurrentAssignment = async () => {
        try {
          const allAssignments = await api.getAssignments();
          const currentAssignment = allAssignments.find(
            (assign) =>
              assign.employee_id === selectedCell.employeeId &&
              assign.assignment_date === selectedCell.assignmentDate
          );

          if (currentAssignment) {
            setSelectedRole(currentAssignment.role_id);
            setSelectedTime(currentAssignment.time_slot_id);
          } else {
            setSelectedRole(null);
            setSelectedTime(null);
          }
        } catch (error) {
          console.error('Failed to fetch current assignment:', error);
        }
      };
      fetchCurrentAssignment();
    }
  }, [isOpen, selectedCell]);

  if (!isOpen || !selectedCell) return null;

  const handleSave = () => {
    if (!selectedRole) {
      alert('Please select a Role / Duty.');
      return;
    }
    onSave(selectedCell.employeeId, selectedCell.assignmentDate, selectedRole, selectedTime);
  };

  const handleDelete = () => {
    onDelete(selectedCell.employeeId, selectedCell.assignmentDate);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 border border-slate-200 dark:border-slate-700 m-4">
        <div className="flex justify-between items-center mb-6 border-b dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Assign Shift</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Scheduling for {selectedCell.employeeName} on {selectedCell.dateLabel}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl p-2">
            &times;
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Role / Duty</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  className={`p-3 rounded border dark:border-slate-700 text-left hover:shadow-md transition relative overflow-hidden group bg-white dark:bg-slate-800
                    ${selectedRole === role.id ? `ring-2 ring-offset-1 dark:ring-offset-slate-900` : ''}`}
                  style={selectedRole === role.id ? { boxShadow: `0 0 0 2px ${role.color}` } : { borderColor: role.color }}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <span className="font-bold relative z-10 text-sm" style={{ color: role.color }}>
                    {role.name}
                  </span>
                  <div
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition"
                    style={{ backgroundColor: role.color }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Time Slot</label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time.id}
                  className={`p-2 rounded border text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-sm bg-white dark:bg-slate-800
                    ${selectedTime === time.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700'}
                  `}
                  onClick={() => setSelectedTime(time.id)}
                >
                  <div className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">{time.label}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">{time.time_range}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t dark:border-slate-700">
          <button
            onClick={handleDelete}
            className="flex-1 py-3 sm:py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm"
          >
            Clear Slot
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-500 font-medium shadow-lg shadow-blue-600/30 text-sm"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignShiftModal;