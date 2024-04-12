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
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'robo',
});

module.exports = dbConnection;

