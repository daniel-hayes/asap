// const AWS = require('aws-sdk');
// const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async results => {
  console.log(results, 'RESSS');

  // var table = "Movies";

  // var year = 2015;
  // var title = "The Big New Movie";

  console.log(process.env.DYNAMODB_TABLE);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      venue: 'venue',
      city: 'city',
      url: 'url',
      createdAt: new Date()
    }
  };

  console.log(params);

  // try {
  //   const response = dynamoDB.put(params).promise();
  //   console.log(response);
  // } catch (err) {
  //   console.error(JSON.stringify(err, null, 2));
  // }

  // console.log("Adding a new item...");
  // docClient.put(params, function(err, data) {
  //     if (err) {
  //         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  //     } else {
  //         console.log("Added item:", JSON.stringify(data, null, 2));
  //     }
  // });
};
