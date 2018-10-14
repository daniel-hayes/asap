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

    const results = await page.evaluate(() =>
      [...document.querySelectorAll('[ng-repeat="venue in PageCtrl.venues"] a')].map(
        (venue, id) => {
          // regex to extract city from url
          const getCity = new RegExp(/\/(.*)\//);
          const url = venue.getAttribute('href');
          return {
            id: id.toString(),
            venue: venue.innerHTML,
            city: getCity.exec(url)[1],
            url
          };
        }
      )
    );

    await browser.close();
    return results;
  } catch (e) {
    console.log(e);
    await browser.close();

    return {
      type: 'error',
      message: e
    };
  }
};
