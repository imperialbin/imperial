import puppeteer from "puppeteer";
import { S3 } from "aws-sdk";
import { Consts } from "./consts";

const s3 = new S3({
  region: Consts.AWS_REGION,
  accessKeyId: Consts.AWS_ACCESS,
  secretAccessKey: Consts.AWS_SECRET,
});

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

    const screenshot = await elementToScreenshot.screenshot({
      type: "jpeg",
      quality,
      clip: {
        x: boundingBox?.x,
        y: boundingBox?.y,
        width: Math.min(boundingBox!.width),
        height: Math.min(boundingBox!.height),
      },
    });

    await s3.upload({
      Bucket: "imperial",
      Key: `${documentId}.jpg`,
      // @ts-ignore
      Body: screenshot,
      ContentEncoding: "base64",
      ContentType: "image/jpg",
    }).promise();
  }

  await browser.close();
};
