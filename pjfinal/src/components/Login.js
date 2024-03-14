import { useState } from "react";
import axios from 'axios';
import "./Register.css"; 
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Modal } from 'antd';
import { useDispatch } from "react-redux";
import React from "react";
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); 
  const [visible, setVisible] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState("");
  const [OTPemail, setOTPemail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);

  const navigateToOtp = () => {
    if (email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      console.log(OTP);
      setOTP(OTP);
      dispatch({
        type: 'OTP',
        payload: OTP
      });
      axios
        .post("http://localhost:8000/api/send_recovery_email", {
          OTP,
          recipient_email: email,
        })
        .then(() => {
          setVisible(false);
          setOtpVisible(true);
        })
        .catch(console.log);
      return;
    }

    return   Swal.fire("Please enter your email"); 
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setOtpVisible(false); 
    setResetPasswordVisible(false);
    setEmail('');
    setOTP('');
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const verfiyOTP = () => {
    console.log("OTPemail", OTPemail);
    console.log("OTP", OTP);
    if (parseInt(OTPemail) === OTP) {
      setResetPasswordVisible(true);
      setOTP('');
      setOTPemail('');
    } else {
      Swal.fire("Incorrect OTP");
    }
  };

  const resetPassword = () => {
    if (newPassword.length >= 8) {

        if (newPassword === confirmNewPassword) {
            console.log("Reset Password:", newPassword);
            axios
            .post(`http://localhost:8000/api/resetpassword`, { email, newPassword })
            .then(response => {
                Swal.fire(response.data.message);
            })
            .catch(err=>{
                console.log(err)
            })
            handleCancel();
          }
        if (!/[A-Z]/.test(newPassword)) {
            return Swal.fire({
                title: "Passwords Error",
                text: "Password must contain at least 1 uppercase letter",
                icon: "error",
            });
        }
    

        if (!/[@#$%^&*()_+={}[\]:;,.?~\\/]/.test(newPassword)) {
            return Swal.fire({
                title: "Passwords Error",
                text: "Password must contain at least 1 special character (!/[@#$%^&*()_+={}[\]:;,.?~\\/]",
                icon: "error",
            });
        }
    
    }
    else{
            return Swal.fire({
            title: "Passwords Error",
            text: "Password must be at least 8 characters long",
            icon: "error",
          });
        }

  };

  const Formsummit = () => {
    axios
      .post(`http://localhost:8000/api/login`, { username, password })
      .then(response => {
        if (response) {
          console.log(response.data.token);
          Swal.fire("Login successfully");
          dispatch({
            type: 'LOGIN',
            payload: response.data.token
          });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', response.data.username);
          navigate('/home');
          setOTPemail('')
          setOTP('');
        }
      })
      .catch(err => {
        console.log(err.response.data)
        Swal.fire("Invalid username or password");
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Form
        onFinish={Formsummit}
        labelCol={{
          span: 10,
        }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input type="text" className="forminput-control" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password type="password" className="forminput-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <button type="submit" value="บันทึก" className="btn">Login</button>
        </Form.Item>
        <a
          href="#"
          onClick={() => showModal()}
          className="text-gray-800"
        >
          Forgot password?
        </a>
        <div className="LoginFooter">
          <p>Don’t have an account yet?</p>
          <Link to='/Register' className="nav-link">Create Account</Link>
        </div>
        

        <Modal
          title="Forgot Password"
          visible={visible}
          onOk={navigateToOtp}
          onCancel={handleCancel}
        >
          <p>Please enter your email:</p>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Modal>
        
        <Modal
          title="Enter OTP"
          visible={otpVisible}
          onOk={verfiyOTP}
          onCancel={handleCancel}
        >
          <p>Please enter the OTP sent to your email: {email}</p>
          <Input type="text" value={OTPemail} onChange={(e) => setOTPemail(e.target.value)} />
        </Modal>

        <Modal
          title="Reset Password"
          visible={resetPasswordVisible}
          onOk={resetPassword}
          onCancel={() => {
            if (!newPassword && !confirmNewPassword ) {
              handleCancel();
            } else {
              Swal.fire({
                title: "Are you sure?",
                text: "If you cancel, the changes will not be saved.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, cancel",
                cancelButtonText: "No, continue editing",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleCancel();
                }
              });
            }
          }}
        >
          <p>Password must contain at least 1 special character (!/[@#$%^&*()_+={}[\]:;,.?~\\/]) And Password must contain at least 1 uppercase letter</p>
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p>Please confirm your new password:</p>
          <Input.Password
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </Modal>
      </Form>
    </div>
  );
};

export default Login;
