import puppeteer from "puppeteer";
import ejs from "ejs";

export const screenshotDocument = async (
  documentId: string,
  quality: number
) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const pageContent = ejs.render("../views/pasted.ejs", {});
  await page.setContent(pageContent);
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
