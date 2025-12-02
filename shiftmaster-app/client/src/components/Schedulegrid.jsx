import React from 'react';
import { useAuth } from './AuthContext';

function ScheduleGrid({
  employees,
  dates,
  assignments,
  roles,
  timeSlots,
  onCellClick,
  onRemoveEmployee,
  isEditable
}) {
  const { currentUser } = useAuth();

  const getAssignmentForCell = (employeeId, dateFullKey) => {
    const assignment = assignments.find(assign =>
      assign.employee_id === employeeId && assign.assignment_date === dateFullKey
    );
    return assignment;
  };

  if (employees.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 dark:text-slate-500 italic justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex">
        No employees found.
      </div>
    );
  }

  return (
    <div className="schedule-grid">
      <div className="grid-header sticky left-0 z-20 border-r border-slate-200 dark:border-slate-700">Employee</div>
      {dates.map((date) => (
        <div key={date.fullKey} className="grid-header border-r border-slate-200 dark:border-slate-700 last:border-r-0">
          <div className="text-xs opacity-70 uppercase">{date.dayName}</div>
          <div className="text-lg text-slate-700 dark:text-slate-200">{date.label}</div>
        </div>
      ))}

      {employees.map((emp) => (
        <React.Fragment key={emp.id}>
          <div className="employee-info-cell">
            <div className="font-bold text-slate-800 dark:text-slate-200 truncate-mobile text-sm sm:text-base">{emp.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate-mobile">{emp.responsibility}</div>
            <div className="text-xs text-blue-500 dark:text-blue-400 mt-1 truncate-mobile"><i className="fa-solid fa-phone text-[10px]"></i> {emp.contact}</div>
            {isEditable && (
              <button
                onClick={() => onRemoveEmployee(emp.id, emp.name)}
                className="text-red-300 hover:text-red-500 text-xs mt-1 self-start"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
          </div>
          {dates.map((date) => {
            const assignment = getAssignmentForCell(emp.id, date.fullKey);
            const assignedRole = assignment ? roles.find(r => r.id === assignment.role_id) : null;
            const assignedTimeSlot = assignment ? timeSlots.find(t => t.id === assignment.time_slot_id) : null;

            let cellClasses = 'grid-cell border-b border-r border-slate-100 dark:border-slate-800';
            let cellStyle = {};
            if (!isEditable) {
              cellClasses += ' read-only-cell';
            }

            if (assignedRole) {
              cellStyle.backgroundColor = `${assignedRole.color}15`;
              cellStyle.borderLeft = `4px solid ${assignedRole.color}`;
            }

            return (
              <div
                key={`${emp.id}-${date.fullKey}`}
                className={cellClasses}
                style={cellStyle}
                onClick={isEditable ? () => onCellClick(emp, date) : undefined}
              >
                {assignedRole ? (
                  <>
                    <div className="shift-tag text-white truncate" style={{ backgroundColor: assignedRole.color }}>{assignedRole.name}</div>
                    {assignedTimeSlot && (
                      <>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium pl-1 truncate-mobile">{assignedTimeSlot.label}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 pl-1 truncate-mobile">{assignedTimeSlot.time_range}</div>
                      </>
                    )}
                  </>
                ) : (isEditable && (
                  <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 text-slate-300 dark:text-slate-600 transition-opacity"><i className="fa-solid fa-plus-circle text-2xl"></i></div>
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ScheduleGrid;