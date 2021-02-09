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
  const url = `https://imperialb.in/p/${documentId}`;
  await page.goto(url)
  await page.addStyleTag({ content: '.menu, #lines{display: none;}' })
  await page.screenshot({ path: `./public/assets/img/${documentId}.jpg`, quality });
  await browser.close();
}