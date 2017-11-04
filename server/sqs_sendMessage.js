'use strict';
const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

sqs.config.setPromisesDependency(require('bluebird'));

var queueURL = "https://sqs.us-west-1.amazonaws.com/858778373274/analyzerservice";

var params = {
  DelaySeconds: 10,
  MessageAttributes: {
   "Title": {
     DataType: "String",
     StringValue: "The Whistler"
    },
   "Author": {
     DataType: "String",
     StringValue: "John Grisham"
    },
   "WeeksOn": {
     DataType: "Number",
     StringValue: "6"
    }
  },
  MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  QueueUrl: queueURL
 };
 
 sqs.sendMessage(params).promise()
  .then((results) => console.log("DONE!"))
  .catch((error) => console.log(error))

 module.exports.sendMessage = sqs.sendMessage;