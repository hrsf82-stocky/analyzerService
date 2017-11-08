// ====================================================== 
// *************** RANDOM VALUE GENERATORS **************
// ====================================================== 

const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");
const Promise = require('bluebird');
const userNumbers = () => { var results = []; for (var i = 0; i < 100000; i ++) { 
      results.push(faker.random.number({min:10000000, max:99999999})) } return results; }
const userArray = userNumbers();
const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
const indicatorTypes = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 
                        'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];

// SAMPLE FROM CLIENT
// var Body = {payload: [ { majorPair: ‘EURUSD’, interval: ‘5s’, indicator: ‘MACD’ } , 
//   { majorPair: ‘USDGBP’, interval: ‘5s’, indicator: ‘MACD’ } , 
//   { majorPair: ‘USDGBP’, interval: ‘1h’, indicator: ‘EMA’ }  ]};
// var Attributes = {
//     session_id: 123456789,
//     user_id: 12345678
// }

// SAMPLE FROM ORDER BOOK
// { userId: INT, profit: FLOAT, pair: STRING }

// ====================================================== 
// **************** GENERATE CLIENT DATA ****************
// ====================================================== 

// Function to make { majorPair: ‘EURUSD’, interval: ‘5s’, indicator: ‘MACD’ } with random values
var makeClientObject = () => {
  var object = {};
  object.majorPair = majorPairTypes[Math.floor(Math.random() * majorPairTypes.length)];
  object.interval = intervalTypes[Math.floor(Math.random() * intervalTypes.length)];
  object.indicator = indicatorTypes[Math.floor(Math.random() * indicatorTypes.length)];
  return object;
}

// Function to make n number of those objects into an array
var makePayload = () => {
  var results = [];
  for (var i = 0; i <= faker.random.number({min:2, max:15}); i ++) {
    results.push(makeClientObject());
  }
  return results;
}

// Function to wrap those in the body property 
var makeClientPacket = () => {
  var object = {
    Body : { payload : makePayload() },
    Attributes : {
        session_id: 123456789,
        user_id: userArray[Math.floor(Math.random() * userArray.length)]
      }
  };
  return object;
}

// Function to make an array of client objects
var clientArrayMaker = () => {
  var results = [];
  for (var i = 0; i < 5000; i ++) {
    results.push(makeClientPacket())
  }
  return results;
}

// console.log(clientArrayMaker());

// ====================================================== 
// **************** GENERATE ORDER DATA *****************
// ====================================================== 

// Function to make { userId: INT, profit: FLOAT, pair: STRING } with random values
var makeOrderObject = () => {
  var object = {};
  object.userId = faker.random.number({min:10000000, max:99999999});
  object.profit = faker.random.number({min:-200, max:500});
  object.pair = majorPairTypes[Math.floor(Math.random() * majorPairTypes.length)];
  return object;
}

// Function to make an array of client objects
var orderArrayMaker = () => {
  var results = [];
  for (var i = 0; i < 1000; i ++) {
    results.push(makeOrderObject())
  }
  return results;
}

// console.log(orderArrayMaker())

// ====================================================== 
// **************** INSERT INTO DATABASE ****************
// ====================================================== 

// INSERT CLIENT DATA FUNCTION WITH PROMISE REDUCE
var bulkClientInsert = () => {
  var list = clientArrayMaker();
  list.reduce((previous, current, index, array) => {
    return previous                                    // initiates the promise chain
    .then(()=>{return database.insertClientData(array[index])})      //adds .then() promise for each item
  }, Promise.resolve())
}

bulkClientInsert();

// INSERT ORDER DATA FUNCTION WITH PROMISE REDUCE
var bulkOrderInsert = () => {
  var list = orderArrayMaker();
  list.reduce((previous, current, index, array) => {
    return previous                                    // initiates the promise chain
    .then(()=>{return database.insertOrderData(array[index])})      //adds .then() promise for each item
  }, Promise.resolve())
}

bulkOrderInsert();