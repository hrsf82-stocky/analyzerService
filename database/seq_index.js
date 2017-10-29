// ====================================================== 
// ************** SEQUELIZE SETUP AND INIT **************
// ====================================================== 


const Sequelize = require('sequelize');
const sequelize = new Sequelize('stocky', '', '', {
  host: 'localhost',
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

const Indicators = sequelize.define('Indicators', {    
    user_id: Sequelize.INTEGER,
    indicator: Sequelize.STRING,
    totalViews: Sequelize.INTEGER,
    average: Sequelize.FLOAT, 
});

const Profits = sequelize.define('Profits', {    
      user_id: Sequelize.INTEGER,
      currencyPair: Sequelize.INTEGER,
      profitNumber: Sequelize.FLOAT,
});