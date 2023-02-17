/* Not cryuptographically safe, but mostly random string */
export const generateString = () => {
  return (Math.random() + 1).toString(36).substring(7);
};
