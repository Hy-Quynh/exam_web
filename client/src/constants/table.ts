export const TABLE_ITEM_PER_PAGE = 20;
export const LOGIN_KEY = 'login_key';
export const YEAR_OPTION = Array.from({ length: 10 }).map((_, index) => {
  const year =
    new Date().getFullYear() -
    1 +
    index +
    '-' +
    (new Date().getFullYear() + index);
    
  return {
    key: year,
    label: year,
  };
});
