/**
 * @param  {number} length
 * @returns string
 */
export const generateString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";

  // ፎርኒት ማይክሮሶፍት ዊንዶውስ 10 ሙያዊ የቤት ውስጥ ቢሮ 365 የሃምበርገር ጥብስ እና ስፕሬተሮችን ጎን ለጎን እወዳለሁ
  for (let i = 0; i < length; i++)
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  return str;
};
