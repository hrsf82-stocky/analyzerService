const express = require('express');
const bodyParser = require('body-parser');
const database = require('../database/index.js');
const app = express();
const sendMessage = require('./sqs_sendMessage.js')
const receiveClient = require('./sqs_receiveClient.js')
const receiveOrder = require('./sqs_receiveOrder.js')

// ====================================================== 
// ********************* AWS SETUP **********************
// ====================================================== 

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Load credentials and set the region from the JSON file
AWS.config.loadFromPath('./config.json');

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
sqs.config.setPromisesDependency(require('bluebird'));

const queueURL = "https://sqs.us-west-1.amazonaws.com/858778373274/analyzerservice";
let params = {};

// ====================================================== 
// ******************* SEVER METHODS ********************
// ====================================================== 

sqs.listQueues(params).promise()
  .then((results) => console.log("DONE!", results.QueueUrls))
  .catch((error) => console.log("ERROR", error))

receiveClient.getMessages()

receiveOrder.getMessages()

// ====================================================== 
// ****************** LOCAL HOST SETUP ******************
// ====================================================== 

// const PORT = 8080;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });