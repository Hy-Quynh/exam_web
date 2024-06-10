import moment from 'moment';

export function displayDate(dateTime: string) {
  return moment(dateTime).format('DD-MM-YYYY');
}

export function formatCountDownTime(seconds: number) {
  // Tính số giờ, phút và giây
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Định dạng giờ, phút và giây để luôn hiển thị 2 chữ số
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  // Trả về chuỗi định dạng hh:mm:ss
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
