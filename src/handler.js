// const AWS = require('aws-sdk');
const { getBrowser } = require('./setup');
const { bookReservation, getVenueList, saveVenuesToDB } = require('./utils');

module.exports.reserve = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const browser = await getBrowser();
    const result = await bookReservation(browser);
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (err) {
    console.error(err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    };
  }
};

module.exports.get_venues = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const browser = await getBrowser();
    const results = await getVenueList(browser);
    await saveVenuesToDB(results);

    return {
      statusCode: 200,
      body: 'Save complete'
    };
  } catch (err) {
    console.error(err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    };
  }
};
