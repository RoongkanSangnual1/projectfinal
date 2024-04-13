const mysql = require('mysql2');



// const dbConnection = mysql.createConnection({
//   host: 'db',
//   port: 3306,
//   user: 'root',
//   password: '1234',
//   database: 'robo',
// });
// module.exports = dbConnection;const mysql = require('mysql2');



const dbConnection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'robo',
});

module.exports = dbConnection;