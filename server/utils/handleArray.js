function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomValues(arr, n) {
  const shuffledArray = shuffle([...arr]); // Xáo trộn mảng đã sao chép
  return shuffledArray.slice(0, n); // Lấy n phần tử đầu tiên từ mảng đã xáo trộn
}

module.exports = {
  getRandomValues
}