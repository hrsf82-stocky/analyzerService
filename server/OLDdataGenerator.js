// ====================================================== 
// *************** RANDOM VALUE GENERATORS **************
// ====================================================== 

const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");
const Promise = require('bluebird');

const rounds = 10000;
const array = PD.rchisq(rounds*2, 100);
const pairIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const majorPair = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
const indicators = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];
const userNumbers = () => { var results = []; for (var i = 0; i < 10000; i ++) { 
    results.push(faker.random.number({min:10000000, max:99999999})) } return results; }
const userIds = () => { var results = []; for (var i = 0; i < 10000; i ++) { results.push(i) } return results; }
const indicatorIds = () => { var results = []; for (var i = 0; i < 360; i ++) { results.push(i) } return results; }

let makeRandom = (data) => {
    let packet = {};
    packet.user_number =  userNumbers().pop();
    packet.userId =  userIds().pop();
    packet.total_sessions = faker.random.number({min:400, max:1000});
    packet.total_views = faker.random.number(300);
    packet.average = packet.total_views/packet.total_sessions;
    packet.indicatorId = indicatorIds().pop();
    packet.array = data;
    packet.pairId = pairIds[Math.floor(Math.random() * pairIds.length)];
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
    packet.total_sessions = data.total_sessions;
    return packet;
}


let userMetricPackets = (data) => {
    var packet = {}
    packet.total_views = data.total_views;
    packet.average = myNamespace.round(data.average, 2);
    packet.userId = data.userId,
    packet.indicatorId = packet.indicatorId;
    return packet;
}


let profitPackets = (data, array) => {
    var packet = {}
    packet.userId = data.userId;
    packet.currency_pair = majorPair[Math.floor(
            Math.random() * majorPair.length)],
    packet.profit_number = array.pop();
    return packet;  
}


var generateData = () => {
    let user_data = [];
    let userMetric_data = [];
    let profit_data = [];
    
    for (let i = 0; i < rounds; i ++) {
        let data = makeRandom(array);
        user_data.push(userPackets(data));
        userMetric_data.push(userMetricPackets(data));
        profit_data.push(profitPackets(data, array));
    }
    
    database.insertUserPackets(user_data)
    .then((results) => {
        console.log(results)
        return database.insertUserMetricPackets(userMetric_data);
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

generateData();

module.exports.makeRandom = makeRandom;
module.exports.generateData = generateData;



