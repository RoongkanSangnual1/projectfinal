import React from "react";
import './maindashboard.css';
import { Card,theme,Collapse,ConfigProvider,Button} from 'antd';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
import { Link} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import Swal from 'sweetalert2'

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

    const Deleteprojuct = (id) => {
      // Get the user's token from localStorage
      const token = localStorage.getItem("token");
    
      // Show a confirmation dialog using SweetAlert
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete!",
      }).then((result) => {
        // Check if the user confirmed the action
        if (result.isConfirmed) {
          // Perform the deletion operation
          axios
            .delete(`http://127.0.0.1:5000/onedelete?project_name_id=${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              
              if (response.status === 200) {
               
                setProjectData((prevData) =>
                  prevData.filter((project) => project[2] !== id)
                );
    
  
                Swal.fire({
                  title: "Deleted!",
                  text: "Your project has been deleted.",
                  icon: "success",
                });
              } else {    
                Swal.fire({
                  title: "Error!",
                  text: "Unable to delete the file. Please try again.",
                  icon: "error",
                });
              }
    
        
              console.log(response);
            })
            .catch((error) => {
           
              Swal.fire({
                title: "Error!",
                text: "An error occurred while deleting the file.",
                icon: "error",
              });
    
          
              console.log(error);
            });
        }
      });
    };
    



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
                                  
                                  <h3 className="projname">
                                      {project[1]}
                                      <pre style={{color:"grey"}}>
                                        {project[3]} <br/>
                                        {project[4] === project[5] ? (
                                          <>
                                            <p style={{color:"red"}}>crawl...</p>
                                          </>
                                        ) : (
                                          <>
                                            Start:({project[4]}) <br/> 
                                            complete:({project[5]})
                                          </>
                                        )}
                                      </pre>
                                    </h3>
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