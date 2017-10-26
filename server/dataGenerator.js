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

let userid =  faker.random.number(99999999);
let views = faker.random.number(500);
let sessions = faker.random.number({min:50, max:1000});
let average = views/sessions;
let array = PD.rchisq(100, 100);
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

let userPacket = () => {
    let packet = {}
    packet.user = {
        user_id: userid,
        totalSessions: sessions,
    }
    return packet;
}

let indicatorPacket = () => {
    let packet = {}
    packet.indicators = {
        user_id: userid,
        indicator: indicator[Math.floor(
            Math.random() * indicator.length)],
        totalViews: views,
        average: myNamespace.round(average, 2),
    }
    return packet;
}

let profitPacket = () => {
    let packet = {}
    packet.profits = {
        user_id: userid,
        currencyPair: majorPair[Math.floor(
            Math.random() * majorPair.length)],
        profitNumber: array[Math.floor(
            Math.random() * array.length)],
    }
    return packet;  
}

// Instantiate the new data packets
let newUser = userPacket();
let newIndicator = indicatorPacket();
let newProfit = profitPacket();

// Run the database function to insert new data
database.insertUserPacket(newUser);
database.insertIndicatorPacket(newIndicator);
database.insertProfitPacket(newProfit);



