const mysql = require('mysql2');
// const dbConnection = mysql.createConnection({
//   // host: 'mysql-server',
//   host:'localhost',
//   user: 'root',
//   password: '',
//   database: 'robo',
// });

// module.exports = dbConnection;const mysql = require('mysql2');
const dbConnection = mysql.createConnection({
   host: 'mysql-server',
  user: 'root',
  password: '1234',
  database: 'robo',
});

module.exports = dbConnection;