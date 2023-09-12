import React from "react";
import './maindashboard.css';
import { Card,theme,Collapse,ConfigProvider,Button} from 'antd';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
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
                /// ส่ง token user แบบheaders
        
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

                  //<Link to={`/myproject/${project[1]}/${project[2]}`}>details</Link>
                  
                  //
                  <div className="projindash">
                   
                    <Collapse className="projcollaspe"
                      collapsible="header"
                      size="small"
                      defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px',marginTop:'40px'}} />}
                      items={[
                      {
                        key: {index},
                        label: <div className="projcollaspe-head">
                                  
                                  <h3 className="projname">{project[1]}</h3>
                                  <Button type="link" icon={<CloseOutlined  style={{ fontSize: '15px',color:'red'}} onClick={()=>Deleteprojuct(project[2])}/>} />
                                  
                                </div>,
                        children: <div className="projcollaspe-content">
                                  <p className="projdes">{project[0]}</p>
                                    
                                  <Link className="projedit-btn" to={`/myproject/${project[1]}/${project[2]}`}><FormOutlined  style={{ fontSize: '15px',color:'grey'}}/></Link>
                                  </div>,
                      },
                      ]}
                      
                    >
                      
                    </Collapse>
                    
                  </div>
                  
                  
                ))}
              </Card>
            </div>
          );
}

export default Dashboard;