var Promise = require('bluebird');

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
    },{
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

sequelize.sync()
    .then((result) => console.log('done'));
    

// ====================================================== 
// ******************* QUERY METHODS ********************
// ====================================================== 

// CLIENT DATA SAMPLE
var body = {payload: [ { majorPair: 'EURUSD', interval: '5s', indicator: 'MACD' } , 
    { majorPair: 'USDGBP', interval: '5s', indicator: 'MACD' } , 
    { majorPair: 'USDGBP', interval: '1h', indicator: 'EMA' }  ]};
    
var attributes = {
    session_id: 123456789,
    user_id: 12345678
}

// ORDER BOOK DATA SAMPLE
var order = { userId: '12345678', profit: '100', pair: 'USDGBP' }

// If receiving message from CLIENT QUEUE
// Identify the user_id from body
// Check if it exists in user table (findOrCreate)
// save the user totalsessions by updating holding variable
// update totalsessions count
// Iterate through the payload array (promise all or promise map)
    // Get the pair name from body, use to lookup id in pair table (findOne)
    // get row id from (pairId, interval from body, indicator from body) (findOne)
    // findOrCreate row in user_metrics table using indicator id and user id 
    // this returns the entire row
    // calculate average from totalviews and totalsessions
    // update the new average and total views at the same time using row id 

// If receiving message from ORDERBOOK QUEUE 
// Identify the user_id from body
// Get the row id of that user from user table
// Identify the currency pair 
// Get the row id of that pair from pair table
// Use row id and pair id to look up profit number in profit table (findOrCreate)
// set default null value to new profit number 
// If exists, update that value

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


// module.exports.insertUserPackets = insertUserPackets;
// module.exports.insertIndicatorPackets = insertIndicatorPackets;
// module.exports.insertProfitPackets = insertProfitPackets;