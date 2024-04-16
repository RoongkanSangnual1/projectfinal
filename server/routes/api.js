const express = require('express')
const router = express.Router()
const {register , login,resetpassword,email,send_recovery_email, share} =require('../controllers/auth')




router.post('/register',register)
router.post('/login',login)
router.post("/resetpassword",resetpassword)
router.get("/",email)
router.post("/send_recovery_email",send_recovery_email)
router.post("/share",share)
module.exports = router



