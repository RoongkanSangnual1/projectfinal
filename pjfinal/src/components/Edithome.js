import React from "react";
import './maindashboard.css';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
import axios from "axios";
import { useState,useEffect } from "react";
import { useParams } from 'react-router-dom';
import Navbar from "./navbar";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import ClipLoader  from "react-spinners/ClipLoader";


const Edithome = () => {
    const { project_name_id } = useParams();
    const [project_name, setProject_name] = useState("");
    const [url, setUrl] = useState("");
    const [project_name_idd, setProject_name_idd] = useState();
    const [load, setLoad] = useState(false);
    const [error, setError] = useState(false);
    const [description, setDescription] = useState("");
    const authUser = localStorage.user;
    const [loadingButton, setLoadingButton] = useState(false);
    const token = localStorage.getItem('token')
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/onedata?project_name_id=${project_name_id}`,{
            headers:{
                Authorization: `Bearer ${token}`,
            },

        })
        .then(response => {
            setProject_name(...project_name,response.data[1].url_target[0][2]);
            setDescription(response.data[1].url_target[0][1]);
            setUrl(response.data[1].url_target[0][0]);
      

        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    const Formsummit = () => {
        setLoad(true);
        setLoadingButton(true);

        axios.put(`http://127.0.0.1:5000/update`, { project_name, authUser, url, description,project_name_id },{
            headers:{
              Authorization:`Bearer ${token}`,
            },
          })
            .then(res => {
                setLoad(false);
                setLoadingButton(false);
                alert(res.data)
            })
            .catch(error => {
                setError("ไม่สามารถทำการได้");
                console.error("error:", error);
            });
    };
        return (
            <div className="App">
            <Navbar />
            <div className="container2">
            <Link to='/home' className="exit" style={{color:"red"}}><CloseOutlined  style={{color:"red"}}/></Link>
            <h2 >Edit Project</h2>
                <div className="createproject-form">
                    <Form
                        onFinish={Formsummit}
                        layout="vertical"
                    >
                        <Form.Item label="Project Name">
                            <Input type="text" className="form-input" value={project_name} onChange={(e) => setProject_name(e.target.value)} />
                        </Form.Item>
                        <Form.Item label=" URL (read only)">
                        <Input type="url" className="form-input" value={url} readOnly />
                        </Form.Item>
                        <Form.Item label="Project details">
                            <Input.TextArea rows={5} className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item>
                        <Form.Item>
                        <button className="btn" type="submit"  style={{backgroundColor:"#304DA5"}}disabled={loadingButton}>
                            {loadingButton ?(
                            <>
                                <ClipLoader 
                                color={"#white"}
                                loading={loadingButton}
                                size={30}
                                aria-label="Loading Spinner"
                               data-testid="loader"
                                />  <br/>  update...
                            </>)  : "update"}
                        </button>
</Form.Item>
                    </Form>
                </div>
            </div>
          </div>
          );
}

export default Edithome;