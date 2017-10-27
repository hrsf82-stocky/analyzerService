const mocker = require('mocker-data-generator').default;
const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");


// ====================================================== 
// *************** GENERATE RANDOM VALUES ***************
// ====================================================== 

const indicator = [ 'MACD', 'EMA', 'MA' ];

const majorPair = [
    'EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY',
    'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY', ];


let makeRandom = () => {
    let packet = {};
    packet.user_id =  faker.random.number({min:10000000, max:99999999});
    packet.views = faker.random.number(500);
    packet.sessions = faker.random.number({min:50, max:1000});
    packet.average = packet.views/packet.sessions;
    packet.array = PD.rchisq(100, 100);
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

let profitPacket = (data) => {
    let packet = {}
    packet.profits = {
        user_id: data.user_id,
        currencyPair: majorPair[Math.floor(
            Math.random() * majorPair.length)],
        profitNumber: data.array[Math.floor(
            Math.random() * data.array.length)],
    }
    return packet;  
}

// Run the database function to insert new data
// var generateData = () => {
//     for (var i = 0; i <= 10000; i ++) {
//         var data = makeRandom();
//         database.insertUserPacket(userPacket(data));
//         database.insertIndicatorPacket(indicatorPacket(data));
//         database.insertProfitPacket(profitPacket(data));
//     }
// }

// generateData()



