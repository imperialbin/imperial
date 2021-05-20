import puppeteer from "puppeteer";
import { Consts } from "./consts";

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

  await page.goto(`${Consts.MAIN_URI}/p/${documentId}`);
  await page.waitForSelector(".ace_content");
  await page.addStyleTag({
    content:
      ".menu {display: none;} .current-line {background: transparent!important}",
  });

  const elementToScreenshot = await page.$(".ace_content");

  const heightOfDocument = await page.evaluate(() => {
    // @ts-ignore We need a TS Ignore here because editor isn't part of anything, its part of the browser
    return editor.renderer.layerConfig.maxHeight;
  });

  const widthOfDocument = await page.evaluate(() => {
    // @ts-ignore We need a TS Ignore here because editor isn't part of anything, its part of the browser
    return editor.renderer.layerConfig.width;
  });

  // @ts-ignore We need this because it doesnt know editor is part of the website
  await page.evaluate(() => editor.navigateFileEnd());

  await page.setViewport({
    width: Math.floor(widthOfDocument),
    height: Math.floor(heightOfDocument),
  });

  if (elementToScreenshot) {
    const boundingBox = await elementToScreenshot.boundingBox();

    await elementToScreenshot.screenshot({
      path: `./public/assets/img/${documentId}.jpg`,
      quality,
      clip: {
        x: boundingBox?.x,
        y: boundingBox?.y,
        width: Math.min(boundingBox!.width, Math.floor(widthOfDocument)),
        height: Math.min(boundingBox!.height, Math.floor(heightOfDocument)),
      },
    });
  }

  await browser.close();
};
