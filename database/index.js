var Promise = require('bluebird');

// ====================================================== 
// ************** SEQUELIZE SETUP AND INIT **************
// ====================================================== 

const Sequelize = require('sequelize');
const sequelize = new Sequelize('stocky2', 'stephaniewong', '', {
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
})

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

sequelize.sync()
    .then((result) => console.log('done'));
    

// ====================================================== 
// **************** BULK INSERT METHODS *****************
// ====================================================== 

// const insertUserPackets = (records)=> {
//     return user.bulkCreate(records);
// }

// const insertIndicatorPackets = (records)=> {
//     return indicator.bulkCreate(records);
// }

// const insertProfitPackets = (records)=> {
//     return profit.bulkCreate(records);
// }


// module.exports.insertUserPackets = insertUserPackets;
// module.exports.insertIndicatorPackets = insertIndicatorPackets;
// module.exports.insertProfitPackets = insertProfitPackets;