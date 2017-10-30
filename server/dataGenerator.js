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


let userPackets = (data) => {
    const userData = [];
    for (var i = 0; i < 100000; i ++) {
        let packet = {}
        packet.user_id = data.user_i;
        packet.totalSessions =data.sessions;
        userData.push(packet);
    }
    return userData;
}

let indicatorPackets = (data) => {
    const indicatorData = [];
        for (var i = 0; i < 100000; i ++) {        
            let packet = {}
            packet.user_id = data.user_id,
            packet.indicator = indicator[Math.floor(
                    Math.random() * indicator.length)];
            packet.totalViews = data.views;
            packet.average = myNamespace.round(data.average, 2);
            indicatorData.push(packet);
        }
    return indicatorData;
}

let profitPackets = (data, array) => {
    const profitData = [];
    for (var i = 0; i < 100000; i ++) {        
        let packet = {}
        packet.user_id = data.user_id;
        packet.currencyPair = majorPair[Math.floor(
                Math.random() * majorPair.length)],
        packet.profitNumber = array.pop();
        profitData.push(packet);
    }
    return profitData;  
}

var generateData = () => {
    array = PD.rchisq(100000, 100);

    var data = makeRandom(array);
    database.insertUserPackets(userPackets(data));
    database.insertIndicatorPackets(indicatorPackets(data));
    database.insertProfitPackets(profitPackets(data, array));
    
    console.log('DONE')
} 

generateData();


module.exports.makeRandom = makeRandom;
module.exports.userPackets = userPackets;
module.exports.indicatorPackets = indicatorPackets;
module.exports.profitPackets = profitPackets;
module.exports.generateData = generateData;


