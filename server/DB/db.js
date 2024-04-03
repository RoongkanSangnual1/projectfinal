const mysql = require('mysql');
const dbConnection = mysql.createConnection({
  host: process.env.BACKEND_URL||'localhost',
  port: 3306,
  user: 'root',
  password: 'MYSQL_ROOT_PASSWORD',
  database: 'robo',
});

module.exports = dbConnection;

