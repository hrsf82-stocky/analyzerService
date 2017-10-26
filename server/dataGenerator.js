var mocker = require('mocker-data-generator').default;
const database = require('../database/index.js');
var faker = require('faker');


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

var userid =  faker.random.number();
var views = faker.random.number(50);
var sessions = faker.random.number({min:50, max:100});
var average = views/sessions;

var myNamespace = {};

myNamespace.round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

var packet = {
    user: {
        id: userid,
        totalSessions: sessions,
    },
    indicators: {
        user_id: userid,
        indicator: indicator[Math.floor(Math.random() * indicator.length)],
        totalViews: views,
        average: myNamespace.round(average, 2),
    },
    profits: {
        user_id: userid,
        currencyPair: majorPair[Math.floor(Math.random() * majorPair.length)],
        profitNumber: faker.random.number({min:10, max:10000000000000}),
    },
}



console.log(packet)
// console.log(user);
// console.log(indicators)
// console.log(profits);

