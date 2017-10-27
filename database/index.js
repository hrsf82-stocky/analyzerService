const pg = require('pg');

// =======================================================
// ***************** CONNECT TO POSTGRESQL ***************
// =======================================================

let config = {};

if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
} else {
  config.user = 'stephaniewong';
  config.password = '';
  config.database = 'stocky';
}

let pool = new pg.Pool(config)
pool.connect();


// =======================================================
// ************** INSERT DATA PACKET QUERIES *************
// =======================================================


let insertUserPacket = (packet) => {
    let queryString = 'INSERT INTO MyUsers (user_id, totalSessions) VALUES ($1, $2)';
    let values = [packet.user.user_id, packet.user.totalSessions];
    pool.query(queryString, values, (err, results) => {
        if (err) {
        console.error('ERROR', err);
        } else {
        console.log('Success!!!')
        }
    });
}

let insertIndicatorPacket = (packet) => {
    let queryString = 'INSERT INTO Indicators (user_id, indicator, totalViews, average) VALUES ($1, $2, $3, $4)';
    let values = [packet.indicators.user_id, packet.indicators.indicator, packet.indicators.totalViews, packet.indicators.average]
    pool.query(queryString, values, (err, results) => {
        if (err) {
        console.error('ERROR', err);
        } else {
        console.log('Success!!!')
        }
    });
}

let insertProfitPacket = (packet) => {
    let queryString = 'INSERT INTO Profits (user_id, currencyPair, profitNumber) VALUES ($1, $2, $3)';
    let values = [packet.profits.user_id, packet.profits.currencyPair, packet.profits.profitNumber]
    pool.query(queryString, values, (err, results) => {
        if (err) {
        console.error('ERROR', err);
        } else {
        console.log('Success!!!')
        }
    });   
}

module.exports.insertUserPacket = insertUserPacket;
module.exports.insertIndicatorPacket = insertIndicatorPacket;
module.exports.insertProfitPacket = insertProfitPacket;