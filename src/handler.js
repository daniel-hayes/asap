const { getBrowser } = require('./setup');
const { bookReservation, fetchVenues, saveVenuesToDB } = require('./utils');

/**
 * Add a reservation request to the DB
 */
module.exports.reserve = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const browser = await getBrowser();
    const result = await bookReservation(browser, event);
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

/**
 * Find the complete list of venues and save them
 * to the database
 */
module.exports.find_venues = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const browser = await getBrowser();
    const results = await findVenueList(browser);
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

/**
 * Fetch all saved venues from the DB
 */
module.exports.fetch_venues = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const results = await fetchVenues();

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
