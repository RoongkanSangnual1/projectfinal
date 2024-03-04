import { useState } from "react";
import axios from 'axios'
import "./Register.css";
import {  Form,Input, Select } from 'antd';
import { Link,useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
const Register = () =>{
    const [username ,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [cpassword,setCpassword] = useState("")
    const [email,setEmail] = useState("")
    const [role,setRole] = useState("")
    const[wrong,setWrong] = useState("")
    const navigate = useNavigate()



    const  validateEmail=(email)=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    const Formsummit = async () => {

        if (username.length >= 6) {
        
        }
        else{
                return Swal.fire({
                title: "Username Error",
                text: "Username must be at least 6 characters long",
                icon: "error",
              });
        }
        if (password.length >= 8) {
        
        }
        else{
                return Swal.fire({
                title: "Passwords Error",
                text: "Password must be at least 8 characters long",
                icon: "error",
              });
        }
        if (validateEmail(email)) {
    
        } else {
            return Swal.fire({
                title: "email Error",
                text: "email don't match",
                icon: "error",
              });
        }
        if (password !== cpassword) {
            return Swal.fire({
                title: "Passwords Error",
                text: "Passwords don't match",
                icon: "error",
              });
        }

    
        try {
            const response = await axios.post(`http://localhost:8000/api/register`, {
                username,
                email,
                password,
                role
            });
    
            console.log(response);
            Swal.fire(response.data);
            navigate('/login');
        } catch (err) {
            console.log(err);
            Swal.fire(err.response.data);
        }
    
        console.log(role);
    };

    return(
        <div className="regis-container">
            <h2>Create Account</h2>
            
            <Form onFinish={Formsummit}
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
                <Input type="text" className="from-control" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                </Form.Item>
                <Form.Item
                label="E-mail"
                name="email"
                rules={[
                    {
                    required: true,
                    message: 'Please input your E-mail!',
                    },
                ]}
                >
                <Input type="text" className="from-control" value={email} onChange={(e)=>setEmail(e.target.value)}/>
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
                <Input.Password type="password" className="from-control" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </Form.Item>
                <Form.Item
                label="Confirm Password"
                name="Cpassword"
                rules={[
                    {
                    required: true,
                    message: 'Please input your password!',
                    },
                ]}
                >
                <Input.Password type="password" className="from-control" value={cpassword} onChange={(e)=>setCpassword(e.target.value)}/>
                </Form.Item>

                <Form.Item
                label="Role"
                name="role"
                rules={[
                    {
                    required: true,
                    message: 'Please input your username!',
                    },
                ]}
                >
                
                <Select  value={role} onChange={(value)=>setRole(value)} options={[
                 { value: 'Standard', label: 'Standard' },
                { value: 'Advance', label: 'Advance' },  ]}>
                    
                </Select>
                </Form.Item>


                <Form.Item>
                
                <button type="submit" value="บันทึก" className="btn">Create Account</button>
                </Form.Item>

            </Form>
            {wrong}
            <div className="LoginFooter">
            <p>Already have an account? </p><Link to='/login' className="nav-link">Login</Link>
            </div>
            
        </div>
    )
}

export default Register ;