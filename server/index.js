const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const app = express();


// ====================================================== 
// ********************* AWS SETUP **********************
// ====================================================== 

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Load credentials and set the region from the JSON file
AWS.config.loadFromPath('./config.json');

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

sqs.listQueues(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.QueueUrls);
  }
});

var queueURL = "https://sqs.us-west-1.amazonaws.com/858778373274/analyzerservice";

var params = {
 AttributeNames: [
    "SentTimestamp"
 ],
 MaxNumberOfMessages: 1,
 MessageAttributeNames: [
    "All"
 ],
 QueueUrl: queueURL,
 VisibilityTimeout: 0,
 WaitTimeSeconds: 0
};

// sqs.receiveMessage(params, function(err, data) {
//   if (err) {
//     console.log("Receive Error", err);
//   } else {
//     var deleteParams = {
//       QueueUrl: queueURL,
//       ReceiptHandle: data.Messages[0].ReceiptHandle
//     };
//     sqs.deleteMessage(deleteParams, function(err, data) {
//       if (err) {
//         console.log("Delete Error", err);
//       } else {
//         console.log("Message Deleted", data);
//       }
//     });
//   }
// });


// ====================================================== 
// ****************** LOCAL HOST SETUP ******************
// ====================================================== 

// const PORT = 8080;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });