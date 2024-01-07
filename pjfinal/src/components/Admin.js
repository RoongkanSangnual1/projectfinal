import React from "react";
import './maindashboard.css';
import { Card,theme,Collapse,ConfigProvider,Button,Form,Select,Input} from 'antd';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
import { Link} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import Navbar from "./navbar";
import './Admin.css'
const Admin = () => {
    const user = localStorage.user
    const [projectdata, setProjectData] = useState([]);
    const [options, setOptions] = useState([]);
    const [Owasp, setOwasp] = useState([]);
    const [payloadone, setPayloadone] = useState(null);
    const [payloadall, setPayloadall] = useState([]);
    const [pay, setPay] = useState(null);
    const [valuepayload, setvaluepayload] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem("token")
      console.log(token)
        // axios.get(`http://127.0.0.1:5000/home`,{
        //   headers:{
        //     Authorization:`Bearer ${token}`,
        //   },
        // })
        //     .then(response => {
        //         setProjectData(response.data.project_data);
        //         console.log(response)

            
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    }, []);

    //   const Deleteprojuct=(id)=>{
    //             /// ส่ง token user แบบheaders
    //       const token = localStorage.getItem("token")
    //       axios.delete(`http://127.0.0.1:5000/onedelete?project_name_id=${id}`,{
    //         headers:{
    //           Authorization:`Bearer ${token}`,
    //         },
    //       })



    //     .then(response => {
    //       setProjectData(projectdata.filter((project=>project[2] !==id )))
    //       console.log(deletee)

    //     })
    //     .catch(error => {
    //     });


    const Formsummit = () => {
        console.log(`1${Owasp}`);
        setPay(Owasp)
        axios
            .post(`http://127.0.0.1:5000/payload`, { Owasp })
            .then(response => {
                const options =JSON.parse(response.data.value[0][0]).map(value => ({
                    value,
                    label: value,
                }));
                setOptions(options);
                
            });
    };


const Formsummit2 = () => {
    console.log(`2${Owasp}`);
        setPay(Owasp)
        axios
            .post(`http://127.0.0.1:5000/payload2`, { payloadone,Owasp,valuepayload })
            .then(response => {
                console.log(response)
                setOptions(options);
                
            });
    };



    const FormsummitAll = () => {
        console.log(`3${Owasp}`);
        setPay(Owasp)
        // axios
        //     .post(`http://127.0.0.1:5000/payload`, { Owasp })
        //     .then(response => {
        //         const options =JSON.parse(response.data.value[0][0]).map(value => ({
        //             value,
        //             label: value,
        //         }));
        //         setOptions(options);
                
        //     });
    };

    const FormsummitAll2 = () => {
        console.log(`3${Owasp}`);
        setPay(Owasp)
        axios
            .post(`http://127.0.0.1:5000/payload3`, { Owasp,payloadall })
            .then(response => {
                
            });
    };



        return (
            <div>
                <Navbar/>

                <div className="inputt-container">                   
            <Form onFinish={Formsummit} labelCol={{span: 10,}} >
                 <Form.Item className="select-container"
                label="Owasp"
                name="Owasp">
    
                <Select    value={Owasp} onChange={(value)=>setOwasp(value)} placeholder="โปรดเลือกรายการ" options={[
                 { value: '1', label: 'Web Server Infomation Leakage through Server header' },
                { value: '2', label: 'Information Leakage through robots.txt' },
                { value: '3', label: 'Web Application Framework Infomation Leakage' },
                { value: '4', label: 'Directory Traversal File Include' },
                { value: '5', label: 'Missing Secure Attribute in Cookie Header' },
                { value: '6', label: 'Missing HttpOnly Attribute in Cookie Header' },
                { value: '7', label: 'Missing Expires Attribute in Cookie Header' },
                { value: '8', label: 'Missing SameSite Attribute in Cookie Header' },
                { value: '9', label: 'Reflected Cross Site Scripting' },
                { value: '10', label: 'Stored Cross Site Scriptng' },
                { value: '11', label: 'SQL Injection' },
                { value: '12', label: 'Command Injection' }, 
                { value: '13', label: 'Missing HTTP Strict Transport Security Header' }, 
                { value: '14', label: 'Sensitive File Disclosure' },  ]}>                             
                </Select>
                </Form.Item>
                <Form.Item>                
                <button  className='btn'type="submit" value="บันทึก">OK</button>
                </Form.Item>

            </Form>
            
            {pay&& (
                    <Form onFinish={Formsummit2} labelCol={{   span: 10, }}>
            <Form.Item  className="select-container" label="Payload" name="Owasp">
          <Select  value={payloadone} onChange={value => setPayloadone(value)} options={options} />
          </Form.Item>
                <Form.Item  className="select-container" label="Value" name="Osp">
                <Input type="text" className="from-control" value={valuepayload} onChange={(e)=>setvaluepayload(e.target.value)}/>
                </Form.Item>
                <Form.Item>                
                <button  className='btn'type="submit" value="บันทึก">OK</button>
                </Form.Item>
          </Form>)
            }



            <Form onFinish={FormsummitAll} labelCol={{span: 10,}} >
                 <Form.Item className="select-container"
                label="Owasp-payload"
                name="Owasp2">
    
                <Select    value={Owasp} onChange={(value)=>setOwasp(value)} placeholder="โปรดเลือกรายการ" options={[
                 { value: '1', label: 'Web Server Infomation Leakage through Server header' },
                { value: '2', label: 'Information Leakage through robots.txt' },
                { value: '3', label: 'Web Application Framework Infomation Leakage' },
                { value: '4', label: 'Directory Traversal File Include' },
                { value: '5', label: 'Missing Secure Attribute in Cookie Header' },
                { value: '6', label: 'Missing HttpOnly Attribute in Cookie Header' },
                { value: '7', label: 'Missing Expires Attribute in Cookie Header' },
                { value: '8', label: 'Missing SameSite Attribute in Cookie Header' },
                { value: '9', label: 'Reflected Cross Site Scripting' },
                { value: '10', label: 'Stored Cross Site Scriptng' },
                { value: '11', label: 'SQL Injection' },
                { value: '12', label: 'Command Injection' }, 
                { value: '13', label: 'Missing HTTP Strict Transport Security Header' }, 
                { value: '14', label: 'Sensitive File Disclosure' },  ]}>                             
                </Select>
                </Form.Item>
                <Form.Item>                
                <button  className='btn'type="submit" value="บันทึก">OK</button>
                </Form.Item>
            </Form>

            {pay&& (
                    <Form onFinish={FormsummitAll2} labelCol={{   span: 10, }}>
                <Form.Item  className="select-container" label="Payload" name="Osp2">
                <Input type="text" className="from-control" value={payloadall} onChange={(e)=>setPayloadall(e.target.value)}/>
                </Form.Item>
                <Form.Item>                
                <button  className='btn'type="submit" value="บันทึก">OK</button>
                </Form.Item>
          </Form>)
            }
                </div>
            </div>

          );
}

export default Admin;