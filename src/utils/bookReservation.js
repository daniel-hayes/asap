const moment = require('moment');
const { RESY_URL, WIDGET_URL } = require('../const');

module.exports = async (browser, reservation) => {
  const { venue, seats, date } = reservation.body;
  const url = `${RESY_URL}/${venue}`;
  const PARAMS = {
    seats,
    date: moment(date)
      .utc()
      .format('YYYY-MM-DD')
  };

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.venue-name', { visible: true, timeout: 10000 });
    const pageContent = await page.content();

    console.log('Scanning page content');

    // this will probably need to change one day
    const venueIdUrl = pageContent.match(/https:\/\/image\.resy\.com.*?\.jpg/g)[0];
    const venueIdUrlArray = venueIdUrl.split('/');
    const venueId = venueIdUrlArray[venueIdUrlArray.length - 2];

    const parameters = Object.keys(PARAMS)
      .map(key => `${key}=${PARAMS[key]}`)
      .join('&');
    await page.goto(
      `${WIDGET_URL}/?ref=${url}&src=resy.com-widget&venueId=${venueId}#/venues/${venueId}?${parameters}`
    );

    console.log('Navigated to restaurant booking page');

    await page.waitForSelector('.service', { visible: true, timeout: 10000 });

    const reservation = await page.evaluate(() => ({
      date: document.querySelector('.date-display').innerHTML,
      availableTimes: [...document.querySelectorAll('.time')].map(time => time.innerHTML)
    }));

    const { date } = reservation;
    const tomorrow = moment().diff(PARAMS.date, 'days') === 0;

    // date format: "month day, year" or is "Tomorrow" (resy innerHTML value)
    if (date === moment(PARAMS.date).format('ll') || (date === 'Tomorrow' && tomorrow)) {
      await browser.close();
      return reservation;
    } else {
      await browser.close();
      return {
        type: 'error',
        message: 'Invalid date'
      };
    }
  } catch (e) {
    await browser.close();
    return {
      type: 'error',
      message: e
    };
  }
};
