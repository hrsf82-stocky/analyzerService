const mocker = require('mocker-data-generator').default;
const database = require('../database/index.js');
const faker = require('faker');
const PD = require("probability-distributions");


const shortid = require('shortid');

const indicator = [
    'macd',
    'ema',
    'movingAvg'
];

const majorPair = [
    'EURUSD',
    'GBPUSD',
    'USDCAD',
    'USDCHF',
    'USDJPY',
    'EURGBP',
    'EURCHF',
    'AUDUSD',
    'EURJPY',
    'GBPJPY',
]

let userid =  faker.random.number(99999999);
let views = faker.random.number(500);
let sessions = faker.random.number({min:50, max:1000});
let average = views/sessions;
let array = PD.rchisq(100, 100);

let myNamespace = {};

myNamespace.round = function(number, precision) {
    let factor = Math.pow(10, precision);
    let tempNumber = number * factor;
    let roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

let packet = function() {
    let packet = {}
    packet.user = {
        id: userid,
        totalSessions: sessions,
    }
    packet.indicators = {
        user_id: userid,
        indicator: indicator[Math.floor(Math.random() * indicator.length)],
        totalViews: views,
        average: myNamespace.round(average, 2),
    }
    packet.profits = {
        user_id: userid,
        currencyPair: majorPair[Math.floor(Math.random() * majorPair.length)],
        profitNumber: array[Math.floor(Math.random() * array.length)],
    }
    return packet;
}

// let newPacket = packet()
// database.chunk(newPacket);
// database.insertFakeData(newPacket)

// console.log(packet)
// console.log(user);
// console.log(indicators)
// console.log(profits);




