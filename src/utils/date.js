export const formatDatetime = (date) => {
  if (!date) {
    return '';
  }

  const rawDate = date instanceof Date ? date : date.toDate();

  const day = String(rawDate.getDate()).padStart(2, '0');
  const month = rawDate.toLocaleString('pt-BR', { month: 'short' });
  const year = rawDate.getFullYear();
  const hours = String(rawDate.getHours()).padStart(2, '0');
  const minutes = String(rawDate.getMinutes()).padStart(2, '0');

  return {
    day,
    month,
    year,
    hours,
    minutes,
  };
}