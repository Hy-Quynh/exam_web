import moment from 'moment';

export function displayDate(dateTime: string) {
  return moment(dateTime).format('DD-MM-YYYY');
}

export function formatCountDownTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}