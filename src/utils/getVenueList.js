const { RESY_URL } = require('../const');

module.exports = async browser => {
  const url = `${RESY_URL}/list-venues`;
  const page = await browser.newPage();

  try {
    await page.goto(url);
    await page.waitForSelector('[ng-repeat="venue in PageCtrl.venues"]', {
      visible: true,
      timeout: 10000
    });

    return await page.evaluate(() =>
      [...document.querySelectorAll('[ng-repeat="venue in PageCtrl.venues"] a')].map(venue => ({
        [venue.innerHTML]: venue.getAttribute('href')
      }))
    );
  } catch (e) {
    console.log(e);
    await browser.close();

    return {
      type: 'error',
      message: e
    };
  }
};
