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
sqs.config.setPromisesDependency(require('bluebird'));

const queueURL = "https://sqs.us-west-1.amazonaws.com/858778373274/analyzerservice";
let params = {};

// ====================================================== 
// ******************* SEVER METHODS ********************
// ====================================================== 

sqs.listQueues(params).promise()
.then((results) => console.log("DONE!", results.QueueUrls))
.catch((error) => console.log("ERROR", error))

sendMessage

// Insert into the Postgres database
app.post('/insert',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.end("INSERT COMPLETE");
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