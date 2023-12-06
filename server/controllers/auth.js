const bcrypt = require('bcryptjs');
const dbConnection = require('../DB/db');
const jwt =require('jsonwebtoken');
const { json } = require('body-parser');





exports.register = async (req, res) => {
  try {
    const { username, email, password,role } = req.body;
    const FindQuery = 'SELECT * FROM user WHERE username = ? OR email = ?';
    dbConnection.query(FindQuery, [username, email], async (resulfinderrorts, results) => {
      if (results.length > 0) {
        return res.status(400).send('มีคนใช้แล้ว');
      }
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      const insertQuery = 'INSERT INTO user (username, email, Password,role) VALUES (?, ?, ?,?)';
      dbConnection.query(insertQuery, [username, email, hashpassword,role], (inserterror, insertresults) => {
        if (insertresults) {
          return res.status(200).send('สมัครเสร็จสิ้น');
        }
      });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};



exports.login = async(req,res) =>{
  try{
    const {username,password} = req.body
    const findQuery = 'SELECT * FROM user WHERE username = ?'
    dbConnection.query(findQuery,[username],async (finderror,results)=>{
      if(results.length === 0){
        return res.status(401).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
      const user = results[0];
      const Cpassword = await bcrypt.compare(password,user.Password)
      if(Cpassword){
        console.log(results)
        const payload = {
          user:{
            username: user.username,
            role:user.role
          }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn: 3600},(err,token)=>{
          if(err) throw err;
          res.status(201).json({ token, payload,username,message: "เข้าสู่ระบบเรียบร้อยแล้ว" });

        })
      }else{
        return res.status(401).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }

    })

  }catch(err){
    res.status(500).send('Server Error')

  }
}



