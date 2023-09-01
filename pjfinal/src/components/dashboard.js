import React from "react";
import './maindashboard.css';
import { Card,Button} from 'antd';
import { PlusOutlined,FormOutlined,DeleteOutlined } from '@ant-design/icons';
import { Link} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";

const Dashboard = () => {
    const user = localStorage.user
    const [projectdata, setProjectData] = useState([]);
    const [deletee,setDelete] = useState([]);
  
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/home?user=${user}`)
            .then(response => {
                setProjectData(response.data.project_data);

            
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

      const Deleteprojuct=(id)=>{
         /// ส่ง token user
        
          axios.delete(`http://127.0.0.1:5000/onedelete?user=${user}&project_name_id=${id}`)


        .then(response => {
          setProjectData(projectdata.filter((project=>project[2] !==id )))
          console.log(deletee)

        })
        .catch(error => {
        });
       
       

    }
        return (
            <div className="mainDash">
              <Card title="My Project" extra={<Link to='/create'><Button type="primary" icon={<PlusOutlined />}>Add to create</Button></Link>}>
                {projectdata.map((project, index) => (
                  <Card key={index} type="inner" title={project[1]} extra={<Link to={`/myproject/${project[1]}/${project[2]}`}>details</Link>}>
                    <div className="projcard-inner">
                    <p>{project[0]}</p>
                      <div className="projcard-inner-ico">
                        <FormOutlined />
                        <DeleteOutlined onClick={()=>Deleteprojuct(project[2])}/>
                      </div>
                    </div>
                    
                  </Card>
                ))}
              </Card>
            </div>
          );
        }

export default Dashboard;