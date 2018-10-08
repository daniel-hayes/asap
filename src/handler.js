// const AWS = require('aws-sdk');
const { getBrowser } = require('./chrome-config/setup');
const { bookReservation, getVenueList, saveVenuesToDB } = require('./utils');

// const lambda = new AWS.Lambda({
//   region: 'us-east-1'
// });

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
    const stuff = await saveVenuesToDB(results);
    console.log(stuff, 'stuff');
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (err) {
    console.error(err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    };
  }
};
