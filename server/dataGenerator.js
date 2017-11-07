// ====================================================== 
// *************** RANDOM VALUE GENERATORS **************
// ====================================================== 

const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");
var Promise = require('bluebird');


// CLIENT DATA SAMPLE
// var data = {
//     body : {payload: [ { majorPair: 'EURUSD', interval: '5s', indicator: 'MACD' } , 
//         { majorPair: 'GBPUSD', interval: '5s', indicator: 'MACD' } , 
//         { majorPair: 'GBPUSD', interval: '1h', indicator: 'EMA' }  ]},

//     attributes : {
//         session_id: 123456789,s
//         user_id: 999999
//     }
// }

const rounds = 300000;
const array = PD.rchisq(rounds*2, 100);
const pairIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const majorPair = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
const indicators = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
const userNumbers = () => { var results = []; for (var i = 0; i < 10000; i ++) { 
    results.push(faker.random.number({min:10000000, max:99999999})) } return results; }
const userIds = () => { var results = []; for (var i = 0; i < 10000; i ++) { results.push(i) } return results; }

let makeRandom = (data) => {
    let packet = {};
    packet.user_number =  userNumbers().pop();
    packet.userId =  userIds().pop();
    packet.sessions = faker.random.number({min:400, max:1000});
    packet.total_views = faker.random.number(300);
    packet.average = packet.totalviews/packet.sessions;
    packet.array = data;
    return packet;
}

let myNamespace = {};

// Helper function round numbers to desired decimal points
myNamespace.round = function(number, precision) {
    let factor = Math.pow(10, precision);
    let tempNumber = number * factor;
    let roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

// ====================================================== 
// ****************** CREATE DATA OBJECTS ***************
// ====================================================== 

let userPackets = (data) => {
    var packet = {}
    packet.user_number = data.user_number;
    packet.total_sessions = data.sessions;
    return packet;
}

let userMetricPackets = (data) => {
    var packet = {}
    packet.userId = data.userId,
    packet.indicatorId = indicator[Math.floor(
            Math.random() * indicator.length)];
    packet.total_views = data.total_views;
    packet.average = myNamespace.round(data.average, 2);
    return packet;
}

let profitPackets = (data, array) => {
    var packet = {}
    packet.user_id = data.user_id;
    packet.currency_pair = majorPair[Math.floor(
            Math.random() * majorPair.length)],
    packet.profit_number = array.pop();
    return packet;  
}

var generateData = () => {

    let user_data = [];
    let indicator_data = [];
    let profit_data = [];
    
    for (let i = 0; i < rounds; i ++) {
        let data = makeRandom(array);
        user_data.push(userPackets(data));
        indicator_data.push(indicatorPackets(data));
        profit_data.push(profitPackets(data, array));
    }
    
    database.insertUserPackets(user_data)
    .then((results) => {
        console.log(results)
        return database.insertIndicatorPackets(indicator_data);
    })
    .then((results) => {
        console.log(results)
        return database.insertProfitPackets(profit_data);
    })
    .then((results) => {
        console.log(results)
        console.log("DONE")
    })
    .catch((error) => {
        console.log(error)
    })

} 

// generateData();

// ====================================================== 
// **************** BULK INSERT METHODS *****************
// ====================================================== 

const insertUserPackets = (records)=> {
    return User.bulkCreate(
        records, 
        {
            updateOnDuplicate: ['user_number','total_sessions']
        }
    );
}

const insertUserMetricPackets = (records)=> {
    return User_metric.bulkCreate(
        records, 
        {
            updateOnDuplicate: ['total_views','average', 'userId', 'indicatorId']
        }
    );
}

const insertProfitPackets = (records)=> {
    return Profit.bulkCreate(
        records, 
        {
            updateOnDuplicate: ['profit_number','userId', 'pairId']
        }
    );
}


module.exports.makeRandom = makeRandom;
module.exports.userPackets = userPackets;
module.exports.indicatorPackets = indicatorPackets;
module.exports.profitPackets = profitPackets;
module.exports.generateData = generateData;
module.exports.insertUserPackets = insertUserPackets;
module.exports.insertUserMetricPackets = insertUserMetricPackets;
module.exports.insertProfitPackets = insertProfitPackets;


