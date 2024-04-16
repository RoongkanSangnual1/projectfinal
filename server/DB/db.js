const mysql = require('mysql2');
const dbConnection = mysql.createConnection({
  host: 'db',
  port: 3306,
  user: 'root',
  password: 'MYSQL_ROOT_PASSWORD',
  database: 'robo',
});

module.exports = dbConnection;

