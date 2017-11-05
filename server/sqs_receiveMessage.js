const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
sqs.config.setPromisesDependency(require('bluebird'));

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
  VisibilityTimeout: 60,
  WaitTimeSeconds: 10
 };

 const getMessages = () => {
   sqs.receiveMessage(params).promise()
    .then((results) => {
      if (results.Messages === undefined) {
        throw "NO NEW SQS MESSAGES!!"
      } else {
        return results
      }
    })
    .then((results) => {
      // DO SOMETHING WITH THE DATA
      // RETURN RESULTS
  
      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: results.Messages[0].ReceiptHandle
       };
       console.log(results.Messages[0].MessageAttributes)
       
       sqs.deleteMessage(deleteParams).promise()
        .then(() => {
          console.log("DELETED!!!")
          getMessages()
        })
    })
    .catch(error => {
      console.log(error);
      setTimeout(getMessages, 5000)
    })
 }

getMessages();

module.exports.receiveMessage = sqs.receiveMessage;