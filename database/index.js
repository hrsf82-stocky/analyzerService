const Promise = require('bluebird');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
AWS.config.loadFromPath('./config.json');
sqs.config.setPromisesDependency(require('bluebird'));

// ====================================================== 
// ************** SEQUELIZE SETUP AND INIT **************
// ====================================================== 

const Sequelize = require('sequelize');
const sequelize = new Sequelize('stocky3', 'stephaniewong', '', {
  host: '127.0.0.1',
  dialect: 'postgres',
});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});


// ====================================================== 
// ***************** MODEL DEFINITIONS ******************
// ====================================================== 
  
const User = sequelize.define('user', {
    user_number: Sequelize.INTEGER,
    total_sessions: Sequelize.INTEGER
});

const Indicator = sequelize.define('indicator', {
    indicator: Sequelize.STRING,
    interval: Sequelize.STRING,
    }, {
        indexes: [ // A BTREE index with an ordered field
            {
                unique: true,
                method: 'BTREE',
                fields: ['indicator', 'interval', 'pairId']
            }
        ]
    }
);

const User_metric = sequelize.define('user_metric', {    
    total_views: Sequelize.INTEGER,
    average: Sequelize.FLOAT, 
    }, {
        indexes: [ // A BTREE index with an ordered field
            {
                unique: true,
                method: 'BTREE',
                fields: ['userId', 'indicatorId']
            }
        ]
    }
);

const Pair = sequelize.define('pair', {
    currency_pair: Sequelize.STRING,    
});

const Profit = sequelize.define('profit', {    
      profit_number: Sequelize.FLOAT,
});

User_metric.belongsTo(User);
User.hasMany(User_metric);

User_metric.belongsTo(Indicator);
Indicator.hasMany(User_metric);

Profit.belongsTo(User);
User.hasMany(Profit);

Profit.belongsTo(Pair);
Pair.hasMany(Profit);

Indicator.belongsTo(Pair);
Pair.hasMany(Indicator);

// >>>>>>>>>>> UNCOMMENT TO SYNC ALL METHODS >>>>>>>>>>>>
// sequelize.sync()
// .then((result) => console.log('done'));

// ====================================================== 
// **************** BULK CREATE METHODS *****************
// ====================================================== 

// Pair.bulkCreate([
//     { currency_pair: 'EURUSD' },
//     { currency_pair: 'GBPUSD' },
//     { currency_pair: 'USDCAD' },
//     { currency_pair: 'USDCHF' },
//     { currency_pair: 'USDJPY' },
//     { currency_pair: 'EURGBP' },
//     { currency_pair: 'EURCHF' },
//     { currency_pair: 'AUDUSD' },
//     { currency_pair: 'EURJPY' },
//     { currency_pair: 'GBPJPY' }
//   ]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
//     return Pair.findAll();
//   }).then(pairs => {
//     console.log(pairs) // ... in order to get the array of user objects
//   }).catch((error) => {console.log(error)})

// const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
// const pairs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// const researchTypes = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
// const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];

// var bulkIndicators = () => {
//     var results = []
//     for (var i = 0; i < researchTypes.length; i ++) {
//        for (var j = 0; j < intervalTypes.length; j++) {
//            for (var k = 0; k < pairs.length; k ++) {
//                var object = {
//                    indicator: researchTypes[i],
//                    interval: intervalTypes[j],
//                    pairId: pairs[k]
//                }
//                results.push(object)
//            }
//        } 
//     }
//     return results;
// }

// const array = bulkIndicators();
// Indicator.bulkCreate( array )


const insertUserPackets = (records)=> {
    return User.bulkCreate( records );
}

const insertUserMetricPackets = (records)=> {
    return User_metric.bulkCreate( records );
}

const insertProfitPackets = (records)=> {
    return Profit.bulkCreate( records );
}


// ====================================================== 
// ******************* QUERY METHODS ********************
// ====================================================== 

// If receiving message from CLIENT QUEUE
const insertClientData = (data) => {
    // Identify the user_id from body
    var number = data.attributes.user_id;
    var actions = data.body.payload;
    var userId;
    var total_sessions;

    // Check if it exists in user table (findOrCreate)
    User.findOrCreate({where: {user_number: number}, defaults: {total_sessions: 0}})
    .spread((user, created) => {
        userId = user.dataValues.id;
        total_sessions = user.dataValues.total_sessions + 1;
        console.log("MADE A NEW USER!!!: ", user.get({ plain: true }))
        console.log("USER HAS BEEN FOUND!!!: ", created);
        return User.update(
            // update totalsessions count
            { total_sessions: user.dataValues.total_sessions + 1 },
            { where: { id: user.dataValues.id } 
        })
    })
    .then(() => {
        // Iterate through the payload array (promise all or promise map)
        return Promise.map(actions, (action) => {
            // Get the pair name from body, use to lookup id in pair table (findOne)
            var pair = action.majorPair;
            // get indicator table row id with (['indicator', 'interval', 'pairId']) (findOne)
            return Pair.findOne({ where: {currency_pair: pair} })
                .then((indicatorRow) => {
                    return Indicator.findOrCreate({where: {indicator: action.indicator, interval: action.interval, pairId: indicatorRow.dataValues.id}})
                })
                .spread((indicator, created) => {
                    console.log("INDICATOR ROW HAS BEEN MADE!!!: ", indicator.get({ plain: true }))
                    console.log("INDICATOR ROW HAS BEEN FOUND!!!: ", created)
                    // findOrCreate row in user_metrics table using indicator id and user id 
                    return User_metric.findOrCreate({where: {userId: userId, indicatorId: indicator.dataValues.id}, defaults: {total_views: 0, average: 0}})
                })
                .spread((metric, created) => {
                    console.log(metric.dataValues.total_views, metric.dataValues.average, created)
                    // update the new average and total views at the same time using row id 
                    return User_metric.update(
                        {total_views: (metric.dataValues.total_views + 1), average: (metric.dataValues.total_views + 1)/total_sessions},
                        { where: { id: metric.dataValues.id } }
                    );
                })
        })
    })
    .then((results) => {
        console.log(results);
    })
    .catch((error) => {
        console.log(error);
    })  
}

// insertClientData(data);


// ORDER BOOK DATA SAMPLE
var order = { userId: '12345678', profit: '100', pair: 'EURUSD' }

// If receiving message from ORDER QUEUE
const insertOrderData = (order) => {
    // Identify the user_id from body
    var userNumber = order.userId;
    var pair = order.pair;
    var profit = order.profit;
    var userId;
    // console.log("$$$$$$$$$$: ", profit)
    // Get the row id of that user from user table
    User.findOrCreate({where: {user_number: userNumber}, defaults: {total_sessions: 1}})
    .then((results) => {
        // console.log("RESULTSSSSSSSSS: ", results[0].dataValues);
        userId = results[0].dataValues.id;
        console.log(pair)
        Pair.findOne({where: {currency_pair: pair}})
        .then((pair) => {
            console.log("PAIRRRRRRRRRRRR: ",pair);
            // Identify the currency patir 
            pairId = pair.dataValues.id;
            console.log("PAIR ID >>>>>>>>>>>>>>: ", pairId)            
            // Use user id and pair id to look up profit number in profit table (findOrCreate)
            // set default null value to new profit number 
            return Profit.findOrCreate({ where: { userId: results[0].dataValues.id}, defaults: {pairId: pairId, profit_number: profit} })
            .spread((user, created) => {
                console.log("MADE A NEW PROFIT!!!: ", user.get({ plain: true }))
                console.log("PROFIT HAS BEEN MADE: ", created);

                // If exists, update that value
                return Profit.update(
                    // update totalsessions count
                    { profit_number: profit },
                    { where: { userId: userId, pairId: pairId} 
                })
            })
        })
    })
    .then((results) => {
        console.log(results);
    })
    .catch((error) => {
        console.log(error);
    })  
}

// insertOrderData(order);

module.exports.insertClientData = insertClientData;
module.exports.insertOrderData = insertOrderData;
module.exports.insertUserPackets = insertUserPackets;
module.exports.insertUserMetricPackets = insertUserMetricPackets;
module.exports.insertProfitPackets = insertProfitPackets;