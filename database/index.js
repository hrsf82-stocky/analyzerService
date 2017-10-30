var Promise = require('bluebird');

// ====================================================== 
// ************** SEQUELIZE SETUP AND INIT **************
// ====================================================== 

const Sequelize = require('sequelize');
const sequelize = new Sequelize('stocky', 'stephaniewong', '', {
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
  
const MyUsers = sequelize.define('MyUsers', {
    user_id: Sequelize.INTEGER,
    totalSessions: Sequelize.INTEGER
});

MyUsers.sync();

const Indicators = sequelize.define('Indicators', {    
    user_id: Sequelize.INTEGER,
    indicator: Sequelize.STRING,
    totalViews: Sequelize.INTEGER,
    average: Sequelize.FLOAT, 
});

Indicators.sync();

const Profits = sequelize.define('Profits', {    
      user_id: Sequelize.INTEGER,
      currencyPair: Sequelize.STRING,
      profitNumber: Sequelize.FLOAT,
});

Profits.sync();

// ====================================================== 
// **************** BULK INSERT METHODS *****************
// ====================================================== 

const insertUserPackets = (records)=> {
    MyUsers.bulkCreate(records);
}

const insertIndicatorPackets = (records)=> {
    Indicators.bulkCreate(records);
}

const insertProfitPackets = (records)=> {
    Profits.bulkCreate(records);
}


module.exports.insertUserPackets = insertUserPackets;
module.exports.insertIndicatorPackets = insertIndicatorPackets;
module.exports.insertProfitPackets = insertProfitPackets;