import puppeteer from "puppeteer";

/**
 * @param  {string} documentId
 * @param  {number} quality
 * @returns Promise
 */
export const screenshotDocument = async (
  documentId: string,
  quality: number
): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(`${process.env.MAIN_URI}/p/${documentId}`);
  await page.waitForSelector(".ace_content");
  await page.addStyleTag({
    content:
      ".menu {display: none;} .current-line {background: transparent!important}",
  });

  const elementToScreenshot = await page.$(".ace_content");

  if (elementToScreenshot) {
    await elementToScreenshot.screenshot({
      path: `./public/assets/img/${documentId}.jpg`,
      quality,
    });
  }

  await browser.close();
};