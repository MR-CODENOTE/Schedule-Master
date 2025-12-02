// api/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('shiftMasterToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

export const getEmployees = async () => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const addEmployee = async (employeeData) => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
};

export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return null;
};

export const getRoles = async () => {
  const response = await fetch(`${API_BASE_URL}/config/roles`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const addRole = async (roleData) => {
  const response = await fetch(`${API_BASE_URL}/config/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(roleData),
  });
  return handleResponse(response);
};

export const deleteRole = async (id) => {
  const response = await fetch(`${API_BASE_URL}/config/roles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return null;
};

export const getTimeSlots = async () => {
  const response = await fetch(`${API_BASE_URL}/config/times`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const addTimeSlot = async (timeSlotData) => {
  const response = await fetch(`${API_BASE_URL}/config/times`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(timeSlotData),
  });
  return handleResponse(response);
};

export const deleteTimeSlot = async (id) => {
  const response = await fetch(`${API_BASE_URL}/config/times/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return null;
};

export const getAssignments = async () => {
  const response = await fetch(`${API_BASE_URL}/assignments`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createOrUpdateAssignment = async (employeeId, assignmentDate, roleId, timeSlotId) => {
  const response = await fetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ employee_id: employeeId, assignment_date: assignmentDate, role_id: roleId, time_slot_id: timeSlotId }),
  });
  return handleResponse(response);
};

export const deleteAssignment = async (employeeId, assignmentDate) => {
  const response = await fetch(`${API_BASE_URL}/assignments/${employeeId}/${assignmentDate}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return null;
};

export const getAuditLogs = async () => {
  const response = await fetch(`${API_BASE_URL}/audit-logs`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const clearAuditLogs = async () => {
  const response = await fetch(`${API_BASE_URL}/audit-logs`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return null;
};

export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return null;
};