import React from "react";
import './maindashboard.css';
import { Card,theme,Collapse,ConfigProvider,Button} from 'antd';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
import { Link} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";

const Home = () => {
    const [projectdata, setProjectData] = useState([]);
    const [deletee,setDelete] = useState([]);
    
  
    useEffect(() => {
      const token = localStorage.getItem("token")
      console.log(token)
        axios.get(`http://127.0.0.1:5000/home`,{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        })
            .then(response => {
                setProjectData(response.data.project_data);
                console.log(response)

            
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

      const Deleteprojuct=(id)=>{
                /// ส่ง token user แบบheaders
          const token = localStorage.getItem("token")
          axios.delete(`http://127.0.0.1:5000/onedelete?project_name_id=${id}`,{
            headers:{
              Authorization:`Bearer ${token}`,
            },
          })



        .then(response => {
          setProjectData(projectdata.filter((project=>project[2] !==id )))
          console.log(response)
          console.log(deletee)

        })
        .catch(error => {
          console.log(error)
        });
       
       

    }
        return (
            <div className="mainDash">
              <Card title="My Project" extra={<Link to='/create'><Button type="primary" icon={<PlusOutlined />}>Add to create</Button></Link>}>
              {projectdata &&
                projectdata.map((project, index) => (

                  //<Link to={`/myproject/${project[1]}/${project[2]}`}>details</Link>
                  
                  //
                  <div className="projindash">
                   
                    <Collapse className="projcollaspe"
                      collapsible="header"
                      size="small"
                      defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px',marginTop:'80px'}} />}
                      items={[
                      {
                        key: {index},
                        label: <div className="projcollaspe-head" >
                                  
                                  <h3 className="projname">{project[1]}<pre style={{color:"grey"}}>{project[3]} ({project[4]}) </pre></h3>
                                  <Button type="link" icon={<CloseOutlined   className="close-button"  style={{ fontSize: '15px',color:'red'}} onClick={()=>Deleteprojuct(project[2])}/>} />
                                  
                                </div>,

                        children: 
                        <div>

                        <Link className="projedit-btn" to={`/myproject/${project[1]}/${project[2]}`}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div className="projcollaspe-content">
                            <p className="projdes" style={{ fontSize: '15px', color: 'grey', marginTop: '0px' }}>{project[0]}</p>
                          </div>
                      
                        <Link to={`/myproject/edit/${project[1]}/${project[2]}`} className="projedit-btn" style={{ marginLeft: '650px' }}>
                          <FormOutlined style={{ fontSize: '15px', color: 'grey' }} />
                        </Link>
                      </div>
                      </Link>
                      </div>
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

export default Home;