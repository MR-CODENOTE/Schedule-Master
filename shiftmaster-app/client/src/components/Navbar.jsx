import React, { useEffect } from 'react';
import { to12Hour } from '../utils/helper';

function Navbar({
  currentUser,
  onLoginClick,
  onLogout,
  onConfigClick,
  onAuditLogClick,
  onUserManagementClick,
  toggleTheme,
  currentDate,
  setCurrentDate,
  onLoadSchedule,
}) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const updateThemeIcon = () => {
      const icon = document.getElementById('themeIcon');
      if (icon) {
        const isDark = document.documentElement.classList.contains('dark');
        icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
    };
    // Initial update and add listener for changes (e.g. from local storage)
    updateThemeIcon();
    const observer = new MutationObserver(updateThemeIcon);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="bg-slate-900 dark:bg-slate-950 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-start">
          <i className="fa-solid fa-calendar-days text-2xl text-blue-400"></i>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">ShiftMaster</h1>
            <div className="text-xs text-slate-400 font-normal">Scheduler System</div>
          </div>
        </div>

        {currentUser && (
          <div className="flex flex-wrap justify-center gap-2 items-center bg-slate-800 dark:bg-slate-900 p-2 rounded-lg border border-slate-700 w-full lg:w-auto">
            <select
              id="monthSelect"
              className="bg-slate-700 dark:bg-slate-800 border-none text-white rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none text-sm flex-grow sm:flex-grow-0"
              value={currentDate.month}
              onChange={(e) => setCurrentDate((prev) => ({ ...prev, month: parseInt(e.target.value) }))}
            >
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              id="yearInput"
              className="bg-slate-700 dark:bg-slate-800 border-none text-white rounded px-3 py-1.5 w-20 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={currentDate.year}
              onChange={(e) => setCurrentDate((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
            />
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs whitespace-nowrap">Week Start:</span>
              <input
                type="number"
                id="startDayInput"
                className="bg-slate-700 dark:bg-slate-800 border-none text-white rounded px-3 py-1.5 w-16 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                min="1"
                max="31"
                value={currentDate.startDay}
                onChange={(e) => setCurrentDate((prev) => ({ ...prev, startDay: parseInt(e.target.value) }))}
              />
            </div>
            <button
              onClick={onLoadSchedule}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              <i className="fa-solid fa-rotate"></i> Load
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 items-center w-full lg:w-auto">
          <div id="authActions" className="flex items-center justify-center gap-2 flex-wrap">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <>
                    <button
                      onClick={onAuditLogClick}
                      className="bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded text-xs font-bold transition text-white border border-slate-500 flex items-center gap-1"
                    >
                      <i className="fa-solid fa-list-check"></i> <span className="hidden sm:inline">Logs</span>
                    </button>
                    <button
                      onClick={onUserManagementClick}
                      className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <i className="fa-solid fa-users"></i> <span className="hidden sm:inline">Users</span>
                    </button>
                  </>
                )}
                <button
                  onClick={onConfigClick}
                  className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-xs transition border border-transparent"
                >
                  <i className="fa-solid fa-gear"></i>
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                  <span className="text-xs text-slate-300 hidden md:inline">Hi, {currentUser.username}</span>
                  <button onClick={onLogout} className="text-red-300 hover:text-white text-xs underline">Logout</button>
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-bold shadow-lg transition"
              >
                <i className="fa-solid fa-right-to-bracket mr-2"></i> Login
              </button>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="bg-slate-700 hover:bg-slate-600 w-9 h-9 flex items-center justify-center rounded-full transition text-yellow-400 dark:text-blue-300 ml-auto lg:ml-0"
          >
            <i id="themeIcon" className="fa-solid fa-sun"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;