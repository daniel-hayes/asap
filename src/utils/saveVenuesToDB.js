const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async results => {
  try {
    const scanResponse = await dynamoDB
      .scan({
        TableName: process.env.DYNAMODB_TABLE
      })
      .promise();

    // filter out already existing venues
    const { Items = [] } = scanResponse;
    const filteredResults = results.filter(r => !Items.some(item => r.url === item.url));

    // write the rest to the database
    if (filteredResults.length) {
      console.log('Writing to database');

      for (const venue of filteredResults) {
        const params = {
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            ...venue,
            createdAt: JSON.stringify(new Date())
          }
        };

        await dynamoDB.put(params).promise();
      }
    }
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
  }
};
