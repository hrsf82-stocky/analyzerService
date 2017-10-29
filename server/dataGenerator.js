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

let userPacket = (data) => {
    let packet = {}
    packet.user = {
        user_id: data.user_id,
        totalSessions: data.sessions,
    }
    return packet;
}

let indicatorPacket = (data) => {
    let packet = {}
    packet.indicators = {
        user_id: data.user_id,
        indicator: indicator[Math.floor(
            Math.random() * indicator.length)],
        totalViews: data.views,
        average: myNamespace.round(data.average, 2),
    }
    return packet;
}

let profitPacket = (data, array) => {
    let packet = {}
    packet.profits = {
        user_id: data.user_id,
        currencyPair: majorPair[Math.floor(
            Math.random() * majorPair.length)],
        profitNumber: array.pop(),
    }
    return packet;  
}

var generateData = () => {
    array = PD.rchisq(500000, 100);

    for (var i = 0; i <= 500000; i ++) {
        var data = makeRandom(array);
        database.insertUserPacket(userPacket(data));
        database.insertIndicatorPacket(indicatorPacket(data));
        database.insertProfitPacket(profitPacket(data, array));
    }
    console.log('DONE')
} 

generateData();


module.exports.makeRandom = makeRandom;
module.exports.userPacket = userPacket;
module.exports.indicatorPacket = indicatorPacket;
module.exports.profitPacket = profitPacket;
module.exports.generateData = generateData;


