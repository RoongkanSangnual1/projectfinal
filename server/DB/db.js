const mysql = require('mysql2');
const dbConnection = mysql.createConnection({
  host: process.env.BACKEND_URL||'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'robo',
});

module.exports = dbConnection;

