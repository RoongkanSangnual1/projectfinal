const express = require('express')
const router = express.Router()
const {register , login,tokenUser} =require('../controllers/auth')
const {auth}  =require('../middleware/auth')



router.post('/register',register)
router.post('/login',login)
// router.get('/create/:project_name',sigleProject)


module.exports = router