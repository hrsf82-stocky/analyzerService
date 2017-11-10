// ====================================================== 
// *************** RANDOM VALUE GENERATORS **************
// ====================================================== 

const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");
const Promise = require('bluebird');
const userNumbers = () => { var results = []; for (var i = 10000000; i <= 10025000; i ++) { 
      results.push(i) } return results; }
      // results.push(faker.random.number({min:79990000, max:80000000})) } return results; }
const userArray = userNumbers();
// console.log(userArray)
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
  for (var i = 0; i < 500; i ++) {
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
  object.userId = userArray[Math.floor(Math.random() * userArray.length)];
  object.profit = faker.random.number({min:-200, max:500});
  object.pair = majorPairTypes[Math.floor(Math.random() * majorPairTypes.length)];
  return object;
}

// Function to make an array of client objects
var orderArrayMaker = () => {
  var results = [];
  for (var i = 0; i < 500; i ++) {
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
  console.time('clientInsert')
  var list = clientArrayMaker();
  console.log(list[0].Body.payload)
  list.reduce((previous, current, index, array) => {
    return previous                                    // initiates the promise chain
    .then(()=>{return database.insertClientData(array[index])})      //adds .then() promise for each item
  }, Promise.resolve())
  .then(() => {
    console.timeEnd('clientInsert')
    console.log('DONE')
  })
}

bulkClientInsert();

// INSERT ORDER DATA FUNCTION WITH PROMISE REDUCE
var bulkOrderInsert = () => {
  console.time('orderInsert')
  var list = orderArrayMaker();
  list.reduce((previous, current, index, array) => {
    return previous                                    // initiates the promise chain
    .then(()=>{return database.insertOrderData(array[index])})      //adds .then() promise for each item
  }, Promise.resolve())
  .then(() => {
    console.timeEnd('orderInsert')
    console.log('DONE')
  })
}

bulkOrderInsert();

// UPDATE OR CREATE STATS
// clientInsert: 598207.213ms
  // 10,000 client + 10,000 order = 20,000 lines
// clientInsert: 51393.045ms
  // 2,000 lines
// clientInsert: 25440.783ms
  // 1,000 lines


// BULK CREATE STATS
// clientInsert: 531.874ms
  // 1,000 lines

