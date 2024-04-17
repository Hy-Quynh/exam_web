import moment from 'moment';

export function displayDate(dateTime: string) {
  return moment(dateTime).format('DD-MM-YYYY');
}
