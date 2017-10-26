const mysql = require('mysql');
const mysqlConfig = require('./config.js');
const connection = mysql.createConnection(mysqlConfig);

var chunk = function (array) {
    var sets = [];
    var array = this.length / 1;
    
    for (var i = 0, j = 0; i < array; i++, j += 1) {
      sets[i] = this.slice(j, j + 1);
    }
    
    return console.log(sets);
};

var insertFakeData = (packet) => {
    for (var key in packet) {
        if (key === 'user') {
            for (var index in packet[key]) {
                // console.log("INDEX: ", index)
                // console.log("VALUE: ", packet[key][index]);
                var idValue;
                var totalSessionsValue;
                if (index === 'id') {
                    idValue = packet[key][index];
                    console.log("ID: ", idValue)
                }
                if (index === 'totalSessions') {
                    totalSessionsValue= packet[key][index];
                    console.log("SESSSSSH: ", totalSessionsValue)
                }

                var queryString = 'insert into users (user, totalSessions) values (?, ?)';
                connection.query(queryString, [idValue, totalSessionsValue], (err, results) => {
                  if (err) {
                    console.error('reached ERROR', err);
                  } else {
                    console.log('Success!')
                  }
                });
            }
        }
        if (key === 'indicators') {
            // console.log(key)
            
        }
        if (key === 'profits') {
            // console.log(key)
            
        }
    }
}

module.exports.insertFakeData = insertFakeData;
module.exports.chunk = chunk;

// var queryString = 'insert into collections (user_id, book_id) values (?, ?)';
// connection.query(queryString, [userId, bookId], (err, results) => {
//   if (err) {
//     console.log('reached here');
//     callback(err, null);
//   } else {
//     getCollectionByUserId(userId, (err, finalResult) => {
//       if (err) {
//         callback(err, null);
//       } else {
//       callback(finalResult, null);
//       }
//     })
//   }
// });