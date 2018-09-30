const { bookReservation } = require('../src/utils');
const config = require('../src/chrome-config/config');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: process.env.SLOWMO_MS,
    dumpio: !!config.DEBUG
  });

  try {
    const result = await bookReservation(browser);
    console.log(result);
  } catch (err) {
    console.error(err);
    await browser.close();
  }

  await browser.close();
})();
