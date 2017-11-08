// ====================================================== 
// ************* RECEIVE FROM ORDER QUEUE ***************
// ====================================================== 

/* !!! The analyzer service does not need to send any messages to the
AWS message bus. This page was created for testing !!!*/

const fs = require('fs');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueURL = "https://sqs.us-west-1.amazonaws.com/858778373274/analyzerservice";
AWS.config.loadFromPath('./config.json');
sqs.config.setPromisesDependency(require('bluebird'));


var params = {
  DelaySeconds: 0,
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