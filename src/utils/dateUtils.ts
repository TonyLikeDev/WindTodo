export const isTaskOverdue = (timeStr?: string) => {
  if (!timeStr) return false;
  
  let dateToCompare = new Date();
  const now = new Date();
  
  if (timeStr.includes('-') && timeStr.includes(':')) {
    dateToCompare = new Date(timeStr.replace(' ', 'T'));
  } else if (timeStr.includes('-')) {
    dateToCompare = new Date(`${timeStr}T23:59:59`);
  } else if (timeStr.includes(':')) {
    const today = now.toISOString().split('T')[0];
    dateToCompare = new Date(`${today}T${timeStr}:00`);
  } else {
    return false; 
  }
  
  return dateToCompare < now;
};
