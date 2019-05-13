export const random = (min = 1, max = 9) =>
  min + Math.floor(Math.random() * (max - min + 1));

export const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  //if (a.length === 0 && )
  return a.reduce((check, el, i) => check && el === b[i], true);
};
