import React, { version } from "react";
import './maindashboard.css';
import { Card,theme,Collapse,ConfigProvider,Button,Select,Form} from 'antd';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import "./home.css"
import ClipLoader  from "react-spinners/ClipLoader";
import Navbar from "./navbar";
import { useState,useEffect } from "react";
import Swal from 'sweetalert2'
import { IoMdTime } from "react-icons/io";
const Home = () => {
    const [projectdata, setProjectData] = useState([]);
    const [projectdata2, setProjectData2] = useState([]);
    const [deletee,setDelete] = useState([]);
    const [vesion,setvesion] = useState([]);

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/home`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Access-Control-Allow-Origin' : '*',
              'Content-Type': 'application/json'
            },
          });
    
          console.log(response)
    
          if (response.data && response.data["server error"]) {
            navigate('/login');
            Swal.fire({
              icon: 'error',
              title: 'User Error',
            });
          } else {
    
            const sortedProjectData = response.data.project_data.sort((a, b) => new Date(b[3]) - new Date(a[3]));
            setProjectData(sortedProjectData);
            console.log("projectdata", projectdata); 
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      fetchData();
    }, []);
    
    const Deleteprojuct = async (id) => {
      try {
      
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete!",
        });
    
      
        if (result.isConfirmed) {
  
          const response = await axios.delete(`http://localhost:5000/onedelete?project_name_id=${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Access-Control-Allow-Origin' : '*',
              'Content-Type': 'application/json'
            },
          });
    
          if (response.status === 200) {
            setProjectData((prevData) =>
              prevData.filter((project) => project[5] !== id)
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
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting the file.",
          icon: "error",
        });
    
        console.log(error);
      }
    };
    
  useEffect(()=>{
    ShowFormsummit();
  },[])
    
    const ShowFormsummit = () => {
  
        console.log(`4${vesion}`);
        if (vesion === '1') {
          const sortedProjectData = projectdata.sort((a, b) => new Date(b[3]) - new Date(a[3]));
          setProjectData([...sortedProjectData]);
        }
        if (vesion === '2') {
          const sortedProjectData = projectdata.sort((b, a) => new Date(b[3]) - new Date(a[3]));
          setProjectData([...sortedProjectData]); 
        }
      }
      return (
        <div className="Home">
          <Card
            className="CardContainer"
            title="My Project"
            extra={
              <>
                <Form onFinish={ShowFormsummit} labelCol={{ span: 10 }}>
                  <Form.Item label="" name="">
                    <Select
                      value={vesion}
                      onChange={(value) => {
                        setvesion(value);
                        ShowFormsummit(value); 
                      }}
                      placeholder={"Latest"}
                      options={[
                        { value: '2', label: 'Latest' },
                        { value: '1', label: 'Oldest' },
                      ]}
                    />
                  </Form.Item>
                </Form>
                <div className="Link-container">
                <Link to="/create">
                  <Button type="primary" icon={<PlusOutlined />}>
                    Add to create
                  </Button>
                </Link>
                </div>
              </>
            }
          >
            <div className="card-container">
              {projectdata.map((project, index) => (
                // <Link
                                        
                //   to={`/myproject/${project[0]assword=''}/${project[5]}`}
                // >
                  <div className="project-item">
                    <div className="CloseOutlined-button">
                    
                    <Button
                      type="link"
                      icon={
                        <CloseOutlined
                          className="CloseOutlined-button"
                          style={{
                            fontSize: '25px',
                            color: 'red',
                          
                          }}
                          onClick={() => Deleteprojuct(project[5])}
                        />
                      
                      }
                    />
                      </div>
                      <Link
                                        
                                        to={`/myproject/${project[0]}/${project[5]}`}
                              >
                    {/* <h1
                      src={`data:image/jpeg;base64,${project[5]}`}
                      alt={`${project[1]}`} className="card-img"
                    />
                     */}
          
                     <h1>
                      {project[1]}
                     </h1>
             
                     </Link>
                     <div className="edit-button">
                     <Link to={`/myproject/edit/${project[0]}/${project[5]}`} >
                        <FormOutlined style={{ fontSize: '25px', color: 'grey'}}/>
                      </Link>
                      </div>
                      <div className="project-details">
                      <h3>Project Name: {project[0].slice(0,30)}</h3>
                      {/* <p>URLs: <a href={project[1]}>{project[1]}</a></p> */}
                      <p>Description: {project[2].slice(0, 30)}</p>
                      {project[3] === project[4] ? (
                       <p style={{ color: "red", position: "relative" }}>
                       <ClipLoader 
                         color={"#white"}
                         size={30}
                         aria-label="Loading Spinner"
                         data-testid="loader"
                       />
                  
                         Scanning 
                     </p>
                      ) : (
                        <>
                          <p>Start: ({project[3]})</p>
                          <p>Complete: ({project[4]})</p>
                          {(() => {
                            const startDate = new Date(project[3]);
                            const endDate = new Date(project[4]);
                            const timeDifference = endDate.getTime() - startDate.getTime();
                            const seconds = Math.floor(timeDifference / 1000);
                            const minutes = Math.floor(seconds / 60);
                            const hours = Math.floor(minutes / 60);
                            const remainingMinutes = minutes % 60;
                            const remainingSeconds = seconds % 60;
                            const timeText = `Time : ${hours} hours: ${remainingMinutes} minutes: ${remainingSeconds} seconds`;
                            return (
                              <div>
                               <p>  <IoMdTime style={{ fontSize: "20px", color:"#1b317e"}} /> {timeText}</p>
                              </div>
                            );
                          })()}
                           <div className="severitybutton-control">
                                    <div className="severitybutton-c"> 
                                    <p>
                                    {project[6]} 
                                    </p>
                                    </div>
                                    <div className="severitybutton-h"> 
                                    <p>
                                    {project[7]} 
                                    </p>
                                    </div>
                                    <div className="severitybutton-m">
                                    <p>
                                    {project[8]} 
                                    </p>
                                       </div>
                                    <div className="severitybutton-l"> 
                                    <p>
                                    {project[9]} 
                                    </p>
                                    </div>
                                  </div>

                        </>
                      )}
                    </div>
                  </div>
               
              ))}
              <div className="project-item2">
                <Link to="/create">
                  <PlusOutlined style={{marginTop:'150px',fontSize:"40px"}} />
                  <h1>
                  Create
                  </h1>
                
                </Link>
              </div>
            </div>
          </Card>
        </div>
      );
      
      
      
              }

export default Home;