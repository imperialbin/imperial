const puppeteer = require('puppeteer');


// this ugly lmfao
module.exports = async (documentId, quality) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    defaultViewport: null
  })
  const page = await browser.newPage();
  await page.goto(`https://imperialb.in/p/9oqpqk4mqht`)
  await page.waitForSelector('.hljs');
  await page.addStyleTag({ content: '.menu, #lines{display: none;}' })
  const elementToScreenshot = await page.$('.hljs');
  await elementToScreenshot.screenshot({ path: `./public/assets/img/${documentId}.jpg`, quality });
  await browser.close();
}