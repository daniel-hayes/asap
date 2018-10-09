const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async results => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: '1',
      venue: 'venuesssss',
      city: 'city',
      url: 'url',
      createdAt: JSON.stringify(new Date())
    }
  };

  console.log(params);

  try {
    const response = dynamoDB.put(params).promise();
    console.log(response, 'response');
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
  }

  // console.log("Adding a new item...");
  // docClient.put(params, function(err, data) {
  //     if (err) {
  //         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  //     } else {
  //         console.log("Added item:", JSON.stringify(data, null, 2));
  //     }
  // });
};
