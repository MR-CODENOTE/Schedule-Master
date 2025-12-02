import React from 'react';

function StatusBanner({ currentUser }) {
  if (currentUser) {
    return (
      <div className="bg-emerald-600 text-white text-center text-xs sm:text-sm py-1 font-medium shadow-md">
        <i className="fa-solid fa-pen-to-square mr-2"></i> Edit Mode Active ({currentUser.role === 'admin' ? 'Administrator' : 'Staff'})
      </div>
    );
  } else {
    return (
      <div className="bg-slate-600 text-white text-center text-xs sm:text-sm py-2 font-medium shadow-md">
        <i className="fa-solid fa-eye mr-2"></i> Public View (Current Week) - Login to Manage
      </div>
    );
  }
}

export default StatusBanner;