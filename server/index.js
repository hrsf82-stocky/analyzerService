const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const app = express();
const sendMessage = require('./sqs_sendMessage.js')
const receiveMessage = require('./sqs_receiveMessage.js')


// ====================================================== 
// ********************* AWS SETUP **********************
// ====================================================== 

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Load credentials and set the region from the JSON file
AWS.config.loadFromPath('./config.json');

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = "https://sqs.us-west-1.amazonaws.com/858778373274/analyzerservice";

var params = {};

sqs.listQueues(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.QueueUrls);
  }
});

// ====================================================== 
// ****************** LOCAL HOST SETUP ******************
// ====================================================== 

// const PORT = 8080;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });