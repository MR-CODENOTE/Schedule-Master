import React, { useEffect } from 'react';

function AuditLogModal({
  isOpen,
  onClose,
  auditLogs,
  onClearLogs,
  onRefreshLogs,
}) {
  useEffect(() => {
    if (isOpen) {
      onRefreshLogs(); // Refresh logs every time modal opens
    }
  }, [isOpen, onRefreshLogs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-3xl p-6 max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-700 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-list-check text-blue-500"></i> System Audit Log
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl p-2">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border rounded dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 py-3">Time</th>
                <th className="px-2 sm:px-4 py-3">User</th>
                <th className="px-2 sm:px-4 py-3">Action</th>
                <th className="hidden sm:table-cell px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-500">No logs recorded yet.</td>
                </tr>
              ) : (
                auditLogs.map((log) => {
                  const date = new Date(log.timestamp).toLocaleString();
                  let actionColor = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                  if (log.action_type.includes("Login")) actionColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
                  if (log.action_type.includes("Logout")) actionColor = "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
                  if (log.action_type.includes("Deleted") || log.action_type.includes("Removed") || log.action_type.includes("Cleared")) actionColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
                  if (log.action_type.includes("Assigned") || log.action_type.includes("Added") || log.action_type.includes("Created")) actionColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

                  return (
                    <tr key={log.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b dark:border-slate-800 last:border-0">
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs text-slate-400 font-mono">{date}</td>
                      <td className="px-2 sm:px-4 py-3 font-semibold text-xs truncate max-w-[80px] sm:max-w-none">{log.actor_username}</td>
                      <td className="px-2 sm:px-4 py-3"><span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${actionColor}`}>{log.action_type}</span></td>
                      <td className="hidden sm:table-cell px-4 py-3 text-xs truncate max-w-xs" title={log.details}>{log.details}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right flex justify-between items-center">
          <button
            onClick={onClearLogs}
            className="text-red-500 text-xs hover:underline hover:text-red-700 p-2"
          >
            Clear History
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditLogModal;