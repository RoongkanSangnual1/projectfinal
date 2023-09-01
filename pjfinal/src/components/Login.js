import { useState } from "react";
import axios from 'axios'
import "./Register.css"; 
import { Link , useNavigate} from "react-router-dom";
import {  Form,Input } from 'antd';
import { useDispatch } from "react-redux";


const Login = () =>{

    const [username ,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const Formsummit =()=>{


        axios
        .post(`http://localhost:8000/api/login`,{username,password})
        .then(response=>{
            if(response){
                alert(response.data.message)
                dispatch({
                    type:'LOGIN',
                    payload:response.data.token
            })
            localStorage.setItem('token',response.data.token)
            localStorage.setItem('user',response.data.username)
                navigate('/home')
                ///ให้ไปหน้าถัดไป navigate มั้ง
            }
        })
        .catch(err=>{
            alert(err.response.data)
        })      
    }


    return(
        <div className="login-container">
            <h2>Login</h2>
            <Form 
            onFinish={Formsummit}
            labelCol={{
                span: 5,
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
                <Input type="text" className="forminput-control" value={username} onChange={(e)=>setUsername(e.target.value)}/>
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
                <Input.Password type="password" className="forminput-control" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </Form.Item>


                <Form.Item>
                
                <button type="submit" value="บันทึก" className="btn">Login</button>
                </Form.Item>

            </Form>
            <div className="LoginFooter">
            <p>Don’t have an account yet?</p><Link to='/Register' className="nav-link">Create Account</Link>
            </div>
            
            
        </div>
  
        

    )
}

export default Login ;