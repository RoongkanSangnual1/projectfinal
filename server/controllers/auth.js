const bcrypt = require('bcryptjs');
const dbConnection = require('../DB/db');
const jwt =require('jsonwebtoken');
const { json } = require('body-parser');
const nodemailer = require("nodemailer");




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
        const role=user.role
        jwt.sign(payload,'jwtSecret',{expiresIn: '1d'},(err,token)=>{
          if(err) throw err;
          res.status(201).json({ token, role,username,message: "เข้าสู่ระบบเรียบร้อยแล้ว" });

        })
      }else{
        return res.status(401).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }

    })

  }catch(err){
    res.status(500).send('Server Error')

  }
}


const resetPassword = async (email, newPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateQuery = 'UPDATE user SET Password = ? WHERE email = ?';
        dbConnection.query(updateQuery, [ hashedPassword,email], (inserterror, insertresults) => {
      if (insertresults) {
        console.log("successfully")
      }
    });
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};


exports.resetpassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email, newPassword)

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    const updateResult = await resetPassword(email, newPassword);

    return res.status(200).json({ message: 'Password reset successfully.', result: updateResult });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.email = async (req, res) => {
  console.log(process.env.MY_EMAIL);
};

exports.send_recovery_email = async  (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
};

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "ROBOPENTESTGUIDE PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">RoboPentestGuide</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing RoboPentestGuide. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />RoboPentestGuide</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>RoboPentestGuide</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}


exports.share = async (req, res) => {
  try {
      const { project_name, usershare } = req.body;    
      if (!project_name || !usershare) {
          return res.status(400).json({ error: 'Missing project_name or usershare' });
      }
      const FindUserQuery = 'SELECT username FROM user WHERE username = ?';
      dbConnection.query(FindUserQuery, [usershare], async (error, userResults) => {
        if (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (userResults.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }   
      const FindQuery = 'SELECT PName, username FROM project WHERE PID = ?';
      dbConnection.query(FindQuery, [project_name], async (error, results) => {
          if (error) {
              console.error('Error:', error);
              return res.status(500).json({ error: 'Internal server error' });
          }      
          if (results.length === 0) {
              return res.status(404).json({ error: 'Project not found' });
          }
          const projectName = results[0].PName;
          const username = results[0].username;       
           const FindUserQuery = 'SELECT email FROM user WHERE username = ?';
          dbConnection.query(FindUserQuery, [usershare], async (error, userResults) => {
              if (error) {
                  console.error('Error:', error);
                  return res.status(500).json({ error: 'Internal server error' });
              }      
              if (userResults.length === 0) {
                  return res.status(404).json({ error: 'User not found' });
              }              
              const email = userResults[0].email;     
              console.log(projectName);
              console.log(username);
              const tyoemail = email.toString('utf-8');
              console.log(tyoemail);
              payload = {'user_id': usershare, 'project_id': project_name,
              'project_name': [[projectName]], 'username': [[username]]}
          const token = jwt.sign(payload, 'jwtSecret', { algorithm: 'HS256' });
          link = `http://localhost:3000/edit-project?Share=${token}`
          console.log(link)
          sendEmail2(tyoemail,link)
          
          .then((response) => res.send(response.message))
          });
      });
    });
  } catch (error) {
      console.error('Errosssr:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};





function sendEmail2(email, link) {
  return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.MY_EMAIL,
              pass: process.env.MY_PASSWORD,
          },
      });

      const mail_configs = {
          from: process.env.MY_EMAIL,
          to: email,
          subject: "ROBOPENTESTGUIDE SHARE",
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>SHARE</title>
          </head>
          <body>
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">RoboPentestGuide</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Thank you for choosing RoboPentestGuide. SHARE user</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${link}</h2>
                <p style="font-size:0.9em;">Regards,<br />RoboPentestGuide</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>RoboPentestGuide</p>
                </div>
              </div>
            </div>
          </body>
          </html>`,
      };

      transporter.sendMail(mail_configs, function (error, info) {
          if (error) {
              // console.log(error);
              return reject({ message: `An error occurred while sending email to ${email}: ${error.message}` });
          }
          return resolve({ message: `Email sent successfully to ${email}` });
      });
  });
}