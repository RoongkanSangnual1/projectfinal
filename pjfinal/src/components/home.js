import React from "react";
import './maindashboard.css';
import { Card,theme,Collapse,ConfigProvider,Button} from 'antd';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import Swal from 'sweetalert2'
import { IoMdTime } from "react-icons/io";
const Home = () => {
    const [projectdata, setProjectData] = useState([]);
    const [deletee,setDelete] = useState([]);
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
  
    useEffect(() => {
      console.log(token)
        axios.get(`http://127.0.0.1:5000/home`,{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        })
            .then(response => {
                setProjectData(response.data.project_data);
                console.log(response)
        if (response.data && response.data["server error"]) {
          navigate('/login')
          Swal.fire({
            icon: 'error',
            title: 'User Eror',
            // text: "User Eror",
          });
         
        }

            
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const Deleteprojuct = (id) => {
      // Get the user's token from localStorage
    
    
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
          {projectdata && projectdata.map((project, index) => (
            <div className="projindash">
              <Collapse
                collapsible="header"
                size="small"
                defaultActiveKey={['1']}
                expandIconPosition="start"
                expandIcon={({ isActive }) => 
                <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} 
                style={{
                  fontSize: '16px',
                  position: 'absolute',
                  top: '50%', // Position the icon at the vertical center
                  transform: 'translateY(-50%)', // Adjust for half of its height}}  />} //, marginTop: '80px' 
                  }}
                />
                } 
                items={[
                  {
                    key: { index },
                    label: (
                      <div className="projcollaspe-head">
                        <h3 className="projname">
                          Project name: {project[1]}
                          <pre style={{ color: "grey" }}>
                            {project[3]} <br/>
                            {project[4] === project[5] ? (
                              <p style={{ color: "red" }}>crawl...</p>
                            ) : (
                              <>
                                Start: ({project[4]}) <br/>
                                Complete: ({project[5]})
                                <br/>
                                {(() => {
                                    const startDate = new Date(project[4]);
                                    const endDate = new Date(project[5]);
                                    const timeDifference = endDate.getTime() - startDate.getTime();
                                    const seconds = Math.floor(timeDifference / 1000);
                                    const minutes = Math.floor(seconds / 60);
                                    const hours = Math.floor(minutes / 60);
                                    const remainingMinutes = minutes % 60;
                                    const remainingSeconds = seconds % 60;
                                    const timeText = `Time : ${hours} hours: ${remainingMinutes} minutes: ${remainingSeconds} seconds`;
                                    return (
                                      <div>
                                      <IoMdTime style={{ fontSize: "20px", color:"#1b317e"}} />  {timeText}
                                      </div>
                                    );
                                  })()}
                                  <div className="severitybutton-control">
                                    <div className="severitybutton-c"> 1</div>
                                    <div className="severitybutton-h"> 1</div>
                                    <div className="severitybutton-m"> 1</div>
                                    <div className="severitybutton-l"> 1</div>
                                  </div>
                                  
                              </>
                            )}
                          </pre>
                        </h3>
                        {/* <Button type="link" icon={<CloseOutlined className="close-button" style={{ fontSize: '15px', color: 'red' }} onClick={() => Deleteprojuct(project[2])} />} /> */}
                      </div>
                    ),
                    children: (
                      <div>
                        <Link style={{ textAlign: "center" }} className="projedit-btn" to={`/myproject/${project[1]}/${project[2]}`}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="projcollaspe-content">
                              <p className="projdes" style={{ fontSize: '15px', color: 'grey', marginTop: '0px', whiteSpace: 'pre-line', maxWidth: '1000px' }}>{project[0]}</p>
                            </div>
                            <Link to={`/myproject/edit/${project[1]}/${project[2]}`} className="projedit-btn" style={{ marginLeft: '650px' }}>
                              <FormOutlined style={{ fontSize: '15px', color: 'grey' }} />
                            </Link>
                          </div>
                        </Link>
                      </div>
                    ),
                    extra: 
                    <Button type="link" 
                      icon={
                      <CloseOutlined className="close-button" 
                      style={{ 
                        fontSize: '15px',
                        color: 'red',
                        position: 'absolute',
                        right: '10px',
                        top: '50%', // Position the button at the vertical center
                        transform: 'translateY(-50%)', // Adjust for half of its height
                        
                      }} 
                      onClick={() => Deleteprojuct(project[2])} 
                      />
                      }
                    />,
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