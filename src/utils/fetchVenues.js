const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async () => {
  try {
    const scanResponse = await dynamoDB
      .scan({
        TableName: process.env.DYNAMODB_TABLE
      })
      .promise();

    return scanResponse;
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
  }
};
