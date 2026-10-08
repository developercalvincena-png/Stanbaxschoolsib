// Normalization utility for Nigerian West Africa Time (WAT - UTC+1)
// Standardizes dates, times, schedules, and timestamps across all school portals

export const formatWestAfricaTime = (
  dateInput?: string | number | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  return d.toLocaleString('en-NG', defaultOptions);
};

export const formatTimeWAT = (dateInput?: string | number | Date): string => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleTimeString('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateWAT = (dateInput?: string | number | Date): string => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString('en-NG', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
