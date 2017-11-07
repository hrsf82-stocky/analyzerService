// ====================================================== 
// *************** RANDOM VALUE GENERATORS **************
// ====================================================== 

const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");
const Promise = require('bluebird');

const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
const indicatorTypes = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 
                        'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];

// SAMPLE FROM CLIENT
// var body = {payload: [ { majorPair: ‘EURUSD’, interval: ‘5s’, indicator: ‘MACD’ } , 
//   { majorPair: ‘USDGBP’, interval: ‘5s’, indicator: ‘MACD’ } , 
//   { majorPair: ‘USDGBP’, interval: ‘1h’, indicator: ‘EMA’ }  ]};
// var attributes = {
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
    body : { payload : makePayload() },
    attributes : {
        session_id: 123456789,
        user_id: faker.random.number({min:10000000, max:99999999})
      }
  };
  return object;
}

// Function to make an array of client objects
var clientArrayMaker = () => {
  var results = [];
  for (var i = 0; i < 10; i ++) {
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
  for (var i = 0; i < 10; i ++) {
    results.push(makeOrderObject())
  }
  return results;
}

// console.log(orderArrayMaker())

// ====================================================== 
// **************** INSERT INTO DATABASE ****************
// ====================================================== 

// PROMISE REDUCE EXAMPLE:
https://stackoverflow.com/questions/24660096/correct-way-to-write-loops-for-promise

// let asyncFn = (item) => {
//   return new Promise((resolve, reject) => {
//     setTimeout( () => {console.log(item); resolve(true)}, 1000 )
//   })
// }

// asyncFn('a')
// .then(()=>{return async('b')})
// .then(()=>{return async('c')})
// .then(()=>{return async('d')})

// let a = ['a','b','c','d']

// a.reduce((previous, current, index, array) => {
//   return previous                                    // initiates the promise chain
//   .then(()=>{return asyncFn(array[index])})      //adds .then() promise for each item
// }, Promise.resolve())


// INSERT CLIENT DATA FUNCTION WITH PROMISE REDUCE
var bulkClientInsert = () => {
  var list = clientArrayMaker();
  list.reduce((previous, current, index, array) => {
    return previous                                    // initiates the promise chain
    .then(()=>{return database.insertClientData(array[index])})      //adds .then() promise for each item
  }, Promise.resolve())
}

// bulkClientInsert();

// INSERT ORDER DATA FUNCTION WITH PROMISE REDUCE
var bulkOrderInsert = () => {
  var list = orderArrayMaker();
  list.reduce((previous, current, index, array) => {
    return previous                                    // initiates the promise chain
    .then(()=>{return database.insertOrderData(array[index])})      //adds .then() promise for each item
  }, Promise.resolve())
}

bulkOrderInsert();