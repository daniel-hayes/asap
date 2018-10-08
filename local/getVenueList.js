const { getVenueList, saveVenuesToDB } = require('../src/utils');
const config = require('../src/chrome-config/config');
const puppeteer = require('puppeteer');

// Maybe a better way of doing this
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: process.env.SLOWMO_MS,
    dumpio: !!config.DEBUG
  });

  try {
    const results = await getVenueList(browser);
    await saveVenuesToDB(results);

    // console.log(results);
  } catch (err) {
    console.error(err);
    await browser.close();
  }

  await browser.close();
})();
