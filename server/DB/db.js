const mysql = require('mysql');
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'robo',
});

module.exports = dbConnection;