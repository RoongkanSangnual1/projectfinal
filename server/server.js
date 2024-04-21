const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
require('dotenv').config()
const dbConnection = require('./DB/db');
const api = require('./routes/api')

const app = express()

dbConnection.connect((err) => {
    if (err) {
      console.log('Error:', err);
      return;
    }
    console.log('Database Connected');
  });

app.use(morgan('dev'))
app.use(bodyParser.json({limit:'20mb'}))
app.use(cors())

app.use('/api',api)

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`Server start ${port}`)
})

