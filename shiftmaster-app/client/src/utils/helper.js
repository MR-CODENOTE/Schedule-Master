// utils/helpers.js

export function to12Hour(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${minutes} ${ampm}`;
}

export function getDatesForWeek(year, month, startDay) {
  let dates = [];
  for (let i = 0; i < 7; i++) {
    let d = new Date(year, month, startDay + i);
    dates.push({
      obj: d,
      label: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      fullKey: formatDateForAPI(d) // YYYY-MM-DD format for backend
    });
  }
  return dates;
}

export function formatDateForAPI(dateObj) {
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Placeholder for client-side data storage logic (if needed in the future for offline/PWA)
// function loadDataClient() { /* ... */ }
// function saveDataClient() { /* ... */ }