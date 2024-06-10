export const parseJSON = (inputString: any, fallback?: any) => {
  if (inputString) {
    try {
      return JSON.parse(inputString);
    } catch (e) {
      return fallback;
    }
  } else {
    return fallback;
  }
};
