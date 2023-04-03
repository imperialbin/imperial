/* Not cryuptographically safe, but mostly random string */
export const generateString = () => (Math.random() + 1).toString(36).substring(7);
