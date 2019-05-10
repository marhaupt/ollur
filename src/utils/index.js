export const random = (min = 1, max = 9) =>
  min + Math.floor(Math.random() * (max - min + 1));
