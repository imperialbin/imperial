import puppeteer from "puppeteer";

export default async (documentId: string, quality: number) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(`https://imperialb.in/p/${documentId}`);
  await page.waitForSelector(".hljs");
  await page.addStyleTag({
    content: ".menu, #lines { display: none; }",
  });

  const elementToScreenshot = await page.$(".hljs");
  await elementToScreenshot?.screenshot({
    path: `../public/assets/img/${documentId}.jpg`,
    quality,
  });

  await browser.close();
};
