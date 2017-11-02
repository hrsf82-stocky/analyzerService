const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");
var Promise = require('bluebird');


// ====================================================== 
// *************** GENERATE RANDOM VALUES ***************
// ====================================================== 

const indicator = [ 'MACD', 'EMA', 'MA' ];

const majorPair = [
    'EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY',
    'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY', ];

let makeRandom = (data) => {
    let packet = {};
    packet.user_id =  faker.random.number({min:10000000, max:99999999});
    packet.views = faker.random.number(500);
    packet.sessions = faker.random.number({min:50, max:1000});
    packet.average = packet.views/packet.sessions;
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
// **************** GENERATE DATA PACKETS ***************
// ====================================================== 

// Number of rows you want to add to database
let rounds = 100000;

let userPackets = (data) => {
    var packet = {}
    packet.user_id = data.user_id;
    packet.total_sessions = data.sessions;
    return packet;
}

let indicatorPackets = (data) => {
    var packet = {}
    packet.user_id = data.user_id,
    packet.indicator = indicator[Math.floor(
            Math.random() * indicator.length)];
    packet.total_views = data.views;
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
    array = PD.rchisq(rounds*2, 100);

    let user_data = [];
    let indicator_data = [];
    let profit_data = [];
    
    for (let i = 0; i < rounds; i ++) {
        let data = makeRandom(array);
        user_data.push(userPackets(data));
        indicator_data.push(indicatorPackets(data));
        profit_data.push(profitPackets(data, array));
    }
    
    database.insertUserPackets(user_data);
    database.insertIndicatorPackets(indicator_data);
    database.insertProfitPackets(profit_data);

    console.log('DONE')
} 

// generateData();


module.exports.makeRandom = makeRandom;
module.exports.userPackets = userPackets;
module.exports.indicatorPackets = indicatorPackets;
module.exports.profitPackets = profitPackets;
module.exports.generateData = generateData;


