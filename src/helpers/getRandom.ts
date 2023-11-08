export const getRandom = (maxLimit = 100) => {
  let random = Math.random() * maxLimit;

  random = Math.floor(random);

  return random;
}