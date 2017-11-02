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
  
const user = sequelize.define('user', {
    user_id: Sequelize.INTEGER,
    total_sessions: Sequelize.INTEGER
});

// user.sync();

const indicator = sequelize.define('indicator', {    
    user_id: Sequelize.INTEGER,
    indicator: Sequelize.STRING,
    total_views: Sequelize.INTEGER,
    average: Sequelize.FLOAT, 
});

// indicator.sync();

const profit = sequelize.define('profit', {    
      user_id: Sequelize.INTEGER,
      currency_pair: Sequelize.STRING,
      profit_number: Sequelize.FLOAT,
});

// profit.sync();


// ====================================================== 
// **************** BULK INSERT METHODS *****************
// ====================================================== 

const insertUserPackets = (records)=> {
    user.bulkCreate(records);
}

const insertIndicatorPackets = (records)=> {
    indicator.bulkCreate(records);
}

const insertProfitPackets = (records)=> {
    profit.bulkCreate(records);
}


module.exports.insertUserPackets = insertUserPackets;
module.exports.insertIndicatorPackets = insertIndicatorPackets;
module.exports.insertProfitPackets = insertProfitPackets;