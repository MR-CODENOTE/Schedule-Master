import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatusBanner from './components/Statusbanner';
import AddEmployeeForm from './components/AddEmployeeForm';
import ScheduleGrid from './components/Schedulegrid';
import AssignShiftModal from './modals/AssignShiftModal';
import ConfigModal from './modals/ConfigModal';
import AuditLogModal from './modals/AuditLogModal';
import LoginModal from './modals/LoginModal';
import UserManagementModal from './modals/UserManagementModal';
import LoadingScreen from './modals/LoadingScreen';
import { useAuth } from './components/AuthContext';
import * as api from './api/api';
import { formatDateForAPI, getDatesForWeek, to12Hour } from './utils/helper';

function App() {
  const { currentUser, login, logout, isLoadingAuth } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAuditLogModalOpen, setIsAuditLogModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoadingScreenOpen, setIsLoadingScreenOpen] = useState(false);
  const [loadingStatusText, setLoadingStatusText] = useState('Initializing system...');

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);

  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return {
      month: today.getMonth(),
      year: today.getFullYear(),
      startDay: today.getDate()
    };
  });

  const [selectedAssignmentCell, setSelectedAssignmentCell] = useState(null); // { emp, date, assignKey }

  const fetchEmployees = useCallback(async () => {
    if (currentUser) {
      try {
        const data = await api.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error.message);
      }
    } else {
      setEmployees([]);
    }
  }, [currentUser]);

  const fetchRoles = useCallback(async () => {
    if (currentUser) {
      try {
        const data = await api.getRoles();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error.message);
      }
    } else {
      setRoles([]);
    }
  }, [currentUser]);

  const fetchTimeSlots = useCallback(async () => {
    if (currentUser) {
      try {
        const data = await api.getTimeSlots();
        setTimeSlots(data);
      } catch (error) {
        console.error('Error fetching time slots:', error.message);
      }
    } else {
      setTimeSlots([]);
    }
  }, [currentUser]);

  const fetchAssignments = useCallback(async () => {
    if (currentUser) {
      try {
        const data = await api.getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error.message);
      }
    } else {
      setAssignments([]);
    }
  }, [currentUser]);

  const fetchAuditLogs = useCallback(async () => {
    if (currentUser?.role === 'admin') {
      try {
        const data = await api.getAuditLogs();
        setAuditLogs(data);
      } catch (error) {
        console.error('Error fetching audit logs:', error.message);
      }
    } else {
      setAuditLogs([]);
    }
  }, [currentUser]);

  const fetchUsers = useCallback(async () => {
    if (currentUser?.role === 'admin') {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    } else {
      setUsers([]);
    }
  }, [currentUser]);

  const loadAllData = useCallback(() => {
    fetchEmployees();
    fetchRoles();
    fetchTimeSlots();
    fetchAssignments();
    fetchAuditLogs();
    fetchUsers();
  }, [fetchEmployees, fetchRoles, fetchTimeSlots, fetchAssignments, fetchAuditLogs, fetchUsers]);

  useEffect(() => {
    loadAllData();
  }, [currentUser, loadAllData]);

  // Theme logic
  useEffect(() => {
    const initTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    initTheme();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleLogin = async (username, password) => {
    setIsLoginModalOpen(false);
    setIsLoadingScreenOpen(true);
    let secondsLeft = 42;
    let messages = [
      "Initializing system…", "Connecting to database…", "Starting backend services…",
      "Generating UI layout…", "Processing requests…", "Finalizing setup…"
    ];
    messages = messages.sort(() => Math.random() - 0.5); // Jumble order
    let msgIndex = 0;

    const updateLoading = () => {
      setLoadingStatusText(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    };
    const msgInterval = setInterval(updateLoading, 8000);

    await new Promise(resolve => setTimeout(resolve, 42000)); // Simulate 42-second load
    clearInterval(msgInterval);
    setIsLoadingScreenOpen(false);

    try {
      const userData = await api.login(username, password);
      login(userData.token, userData.user);
      loadAllData(); // Reload data after login
    } catch (error) {
      alert(error.message || 'Login failed.');
      setIsLoginModalOpen(true); // Re-open login modal on failure
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      // We removed the lines that clear the schedule!
    
    // Only clear sensitive admin data:
    setAuditLogs([]);
    setUsers([]);
    }
  };

  // Employee CRUD
  const addEmployee = async (employeeData) => {
    try {
      await api.addEmployee(employeeData);
      fetchEmployees();
    } catch (error) {
      alert('Error adding employee: ' + error.message);
    }
  };

  const removeEmployee = async (id, name) => {
    if (window.confirm(`Remove employee ${name}?`)) {
      try {
        await api.deleteEmployee(id);
        fetchEmployees();
        fetchAssignments(); // Assignments linked to employee also deleted
      } catch (error) {
        alert('Error removing employee: ' + error.message);
      }
    }
  };

  // Role & Time Slot CRUD (Config Modal)
  const addRole = async (name, color) => {
    try {
      await api.addRole({ name, color });
      fetchRoles();
    } catch (error) {
      alert('Error adding role: ' + error.message);
    }
  };

  const deleteRole = async (id, name) => {
    if (window.confirm(`Delete role '${name}'? This cannot be undone if assignments exist.`)) {
      try {
        await api.deleteRole(id);
        fetchRoles();
        fetchAssignments(); // To reflect changes if roles were linked to assignments (e.g. SET NULL)
      } catch (error) {
        alert('Error deleting role: ' + error.message);
      }
    }
  };

  const addTimeSlot = async (label, start, end) => {
    const time_range = (start && end) ? `${to12Hour(start)} - ${to12Hour(end)}` : 'Flexible';
    try {
      await api.addTimeSlot({ label, time_range });
      fetchTimeSlots();
    } catch (error) {
      alert('Error adding time slot: ' + error.message);
    }
  };

  const deleteTimeSlot = async (id, label) => {
    if (window.confirm(`Delete time slot '${label}'? This cannot be undone if assignments exist.`)) {
      try {
        await api.deleteTimeSlot(id);
        fetchTimeSlots();
        fetchAssignments();
      } catch (error) {
        alert('Error deleting time slot: ' + error.message);
      }
    }
  };

  // Assignment Logic
  const openAssignModal = (emp, date) => {
    if (!currentUser) return;
    setSelectedAssignmentCell({
      employeeId: emp.id,
      assignmentDate: formatDateForAPI(date.obj),
      employeeName: emp.name,
      dateLabel: `${date.dayName}, ${date.label}`
    });
    setIsAssignModalOpen(true);
  };

  const saveAssignment = async (employeeId, assignmentDate, roleId, timeSlotId) => {
    try {
      await api.createOrUpdateAssignment(employeeId, assignmentDate, roleId, timeSlotId);
      fetchAssignments();
      setIsAssignModalOpen(false);
    } catch (error) {
      alert('Error saving assignment: ' + error.message);
    }
  };

  const deleteAssignment = async (employeeId, assignmentDate) => {
    if (window.confirm("Are you sure you want to clear this shift?")) {
      try {
        await api.deleteAssignment(employeeId, assignmentDate);
        fetchAssignments();
        setIsAssignModalOpen(false);
      } catch (error) {
        alert('Error deleting assignment: ' + error.message);
      }
    }
  };

  // Audit Log Actions
  const clearAuditLog = async () => {
    if (window.confirm("Are you sure you want to clear the entire audit history? This cannot be undone.")) {
      try {
        await api.clearAuditLogs();
        fetchAuditLogs();
      } catch (error) {
        alert('Error clearing audit log: ' + error.message);
      }
    }
  };

  // User Management Actions
  const addUser = async (username, password, role) => {
    try {
      await api.createUser({ username, password, role });
      fetchUsers();
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
  };

  const deleteUser = async (id, username) => {
    if (id === 'admin_builtin') {
      alert('The built-in admin account cannot be deleted.');
      return;
    }
    if (window.confirm(`Delete user '${username}'?`)) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const ftEmployees = employees.filter(emp => emp.type === 'FT');
  const ptEmployees = employees.filter(emp => emp.type === 'PT');
  const weekDates = getDatesForWeek(currentDate.year, currentDate.month, currentDate.startDay);

  if (isLoadingAuth) {
    return <LoadingScreen isOpen={true} statusText="Authenticating session..." countdown={0} />; // A simple loading for initial auth check
  }

  return (
    <div className="App">
      <Navbar
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onConfigClick={() => {
          if (currentUser) setIsConfigModalOpen(true);
        }}
        onAuditLogClick={() => {
          if (currentUser?.role === 'admin') setIsAuditLogModalOpen(true);
        }}
        onUserManagementClick={() => {
          if (currentUser?.role === 'admin') setIsUserModalOpen(true);
        }}
        toggleTheme={toggleTheme}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onLoadSchedule={loadAllData}
      />

      <StatusBanner currentUser={currentUser} />

      <div className="container mx-auto p-2 sm:p-4 md:p-6 space-y-6">
        {currentUser && (
          <AddEmployeeForm onAddEmployee={addEmployee} />
        )}

        <section>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="w-3 h-8 bg-blue-600 rounded-full"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Full Time Employees</h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium">{ftEmployees.length} Staff</span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <ScheduleGrid
              employees={ftEmployees}
              dates={weekDates}
              assignments={assignments}
              roles={roles}
              timeSlots={timeSlots}
              onCellClick={openAssignModal}
              onRemoveEmployee={removeEmployee}
              isEditable={!!currentUser}
            />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="w-3 h-8 bg-orange-500 rounded-full"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Part Time Employees</h2>
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs px-2 py-1 rounded-full font-medium">{ptEmployees.length} Staff</span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <ScheduleGrid
              employees={ptEmployees}
              dates={weekDates}
              assignments={assignments}
              roles={roles}
              timeSlots={timeSlots}
              onCellClick={openAssignModal}
              onRemoveEmployee={removeEmployee}
              isEditable={!!currentUser}
            />
          </div>
        </section>
      </div>

      <AssignShiftModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        selectedCell={selectedAssignmentCell}
        roles={roles}
        timeSlots={timeSlots}
        onSave={saveAssignment}
        onDelete={deleteAssignment}
      />

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        roles={roles}
        timeSlots={timeSlots}
        onAddRole={addRole}
        onDeleteRole={deleteRole}
        onAddTimeSlot={addTimeSlot}
        onDeleteTimeSlot={deleteTimeSlot}
      />

      <AuditLogModal
        isOpen={isAuditLogModalOpen}
        onClose={() => setIsAuditLogModalOpen(false)}
        auditLogs={auditLogs}
        onClearLogs={clearAuditLog}
        onRefreshLogs={fetchAuditLogs}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={users}
        onAddUser={addUser}
        onDeleteUser={deleteUser}
        onRefreshUsers={fetchUsers}
      />

      <LoadingScreen
        isOpen={isLoadingScreenOpen}
        statusText={loadingStatusText}
        countdown={42} // Hardcoded for this specific request
      />
    </div>
  );
}

export default App;