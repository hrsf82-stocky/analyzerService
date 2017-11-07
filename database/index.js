const Promise = require('bluebird');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
AWS.config.loadFromPath('../server/config.json');
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
//   })

const majorPairTypes = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDCHF', 'USDJPY', 'EURGBP', 'EURCHF', 'AUDUSD', 'EURJPY', 'GBPJPY'];
const pairs = [1,2,3,4,5,6,7,8,9,10]
const researchTypes = ['MACD', 'EMA', 'MA', 'SMA', 'Bollinger', 'Fibonacci'];
const intervalTypes = ['5s', '1', '30', '1h', '1d', '1m'];

var bulkIndicators = () => {
    var results = []
    for (var i = 0; i < researchTypes.length; i ++) {
       for (var j = 0; j < intervalTypes.length; j++) {
           for (var k = 0; k < pairs.length; k ++) {
               var object = {
                   indicator: researchTypes[i],
                   interval: intervalTypes[j],
                   pairId: pairs[k]
               }
               results.push(object)
           }
       } 
    }
    return results;
}

// console.log(bulkIndicators())

// Indicator.bulkCreate(bulkIndicators()).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
//     return Pair.findAll();
//   }).then(pairs => {
//     console.log(pairs) // ... in order to get the array of user objects
//   })

// UNCOMMENT TO SYNC ALL METHODS
// sequelize.sync()
//     .then((result) => console.log('done'));

// ====================================================== 
// ******************* QUERY METHODS ********************
// ====================================================== 

// CLIENT DATA SAMPLE
var data = {
    body : {payload: [ { majorPair: 'EURUSD', interval: '5s', indicator: 'MACD' } , 
        { majorPair: 'GBPUSD', interval: '5s', indicator: 'MACD' } , 
        { majorPair: 'GBPUSD', interval: '1h', indicator: 'EMA' }  ]},

    attributes : {
        session_id: 123456789,
        user_id: 999999
    }
}
    

// ORDER BOOK DATA SAMPLE
// var order = { userId: '12345678', profit: 'FLOAT', pair: 'USDGBP' }

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
        console.log("USERRRRRRRRRRR: ", user.get({
         plain: true
        }))
        console.log("MADE IT!!!!!!!!: ", created);
        return User.update(
            // update totalsessions count
            { total_sessions: user.dataValues.total_sessions + 1 },
            { where: { id: user.dataValues.id } 
        })
    })
    .then(() => {
        // Iterate through the payload array (promise all or promise map)
        return Promise.map(actions, (action) => {
            var pair = action.majorPair;
            // Get the pair name from body, use to lookup id in pair table (findOne)
            return Pair.findOne({ where: {currency_pair: pair} })
                .then((project) => {
                    // var lookup = action.indicator + action.interval + project.dataValues.id;
                    console.log("PROJECTTTTTTTTT:")
                    return Indicator.findOrCreate({where: {indicator: action.indicator, interval: action.interval, pairId: project.dataValues.id}})
                })
                .spread((indicator, created) => {
                    console.log("USERRRRRRRRRRR: ", indicator.get({ plain: true }))
                    console.log("MADE IT!!!!!!!!: ", created)
                    return User_metric.findOrCreate({where: {userId: userId, indicatorId: indicator.dataValues.id}, defaults: {total_views: 0, average: 0}})
                })
                .spread((metric, created) => {
                    console.log(metric.dataValues.total_views, metric.dataValues.average, created)
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

    // get row id from (['indicator', 'interval', 'pairId']) (findOne)
        // findOrCreate row in user_metrics table using indicator id and user id 
        // this returns the entire row
        // calculate average from totalviews and totalsessions
        // update the new average and total views at the same time using row id 
}

insertClientData(data);

// If receiving message from ORDER QUEUE
const insertOrderData = (data) => {
    // If receiving message from ORDERBOOK QUEUE 
    // Identify the user_id from body
    // Get the row id of that user from user table
    // Identify the currency pair 
    // Get the row id of that pair from pair table
    // Use row id and pair id to look up profit number in profit table (findOrCreate)
    // set default null value to new profit number 
    // If exists, update that value

}


// ====================================================== 
// **************** BULK INSERT METHODS *****************
// ====================================================== 

const insertUserPackets = (records)=> {
    return user.bulkCreate(records);
}

const insertIndicatorPackets = (records)=> {
    return indicator.bulkCreate(records);
}

const insertProfitPackets = (records)=> {
    return profit.bulkCreate(records);
}


module.exports.insertUserPackets = insertUserPackets;
module.exports.insertIndicatorPackets = insertIndicatorPackets;
module.exports.insertProfitPackets = insertProfitPackets;
module.exports.insertClientData = insertClientData;
module.exports.insertOrderData = insertOrderData;
