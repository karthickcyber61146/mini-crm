export function startOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}
