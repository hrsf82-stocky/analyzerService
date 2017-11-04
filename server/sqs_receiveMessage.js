const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

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
 
 sqs.receiveMessage(params, function(err, data) {
   if (err) {
     console.log("Receive Error", err);
   } else {
     var deleteParams = {
       QueueUrl: queueURL,
       ReceiptHandle: data.Messages[0].ReceiptHandle
     };
     sqs.deleteMessage(deleteParams, function(err, data) {
       if (err) {
         console.log("Delete Error", err);
       } else {
         console.log("Message Deleted", data);
       }
     });
   }
 });

 module.exports.receiveMessage = sqs.receiveMessage;