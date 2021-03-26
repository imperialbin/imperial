import puppeteer from "puppeteer";

export const screenshotDocument = async (
  documentId: string,
  quality: number
) => {
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
  const boundingBox = await elementToScreenshot?.boundingBox();
  console.log(boundingBox);

  if (elementToScreenshot && boundingBox) {
    
    await elementToScreenshot.screenshot({
      path: `./public/assets/img/${documentId}.jpg`,
      quality,
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
      },
    });
  }

  await browser.close();
};
