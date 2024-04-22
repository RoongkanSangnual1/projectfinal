import React, { version } from "react";
import "./maindashboard.css";
import {
  Card,
  theme,
  Collapse,
  ConfigProvider,
  Button,
  Select,
  Form,
} from "antd";
import {
  PlusOutlined,
  RightOutlined,
  CloseOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Link, useHref, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { IoMdTime } from "react-icons/io";
const Home = () => {
  const [projectdata, setProjectData] = useState([]);
  const [projectdata2, setProjectData2] = useState([]);
  const [deletee, setDelete] = useState([]);
  const [vesion, setvesion] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data["server error"]) {
          navigate("/login");
          Swal.fire({
            icon: "error",
            title: "User Error",
          });
        } else {
          const sortedProjectData = response.data.project_data.sort(
            (a, b) => new Date(b[3]) - new Date(a[3])
          );
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
        title: "Confirm Delete?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:5000/onedelete?project_name_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );

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

  useEffect(() => {
    ShowFormsummit();
  }, []);

  const ShowFormsummit = () => {
    console.log(`4${vesion}`);
    if (vesion === "1") {
      const sortedProjectData = projectdata.sort(
        (a, b) => new Date(b[3]) - new Date(a[3])
      );
      setProjectData([...sortedProjectData]);
    }
    if (vesion === "2") {
      const sortedProjectData = projectdata.sort(
        (b, a) => new Date(b[3]) - new Date(a[3])
      );
      setProjectData([...sortedProjectData]);
    }
  };

  return (
    <div className="mainDash">
      
      <Card
        className="projcard"
        title={<h2>My Project</h2>}
        extra={
          <>
            <div className="projcard-extra">
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
                      { value: "2", label: "Latest" },
                      { value: "1", label: "Oldest" },
                    ]}
                  />
                </Form.Item>
              </Form>
              <Link to="/create">
                <Button type="primary" icon={<PlusOutlined />}>
                  Add new project
                </Button>
              </Link>
            </div>
          </>
        }
      >
        {" "}
        {projectdata &&
          projectdata.map((project, index) => (
            <div className="projindash">
              <Collapse
                collapsible="icon"
                size="small"
                defaultActiveKey={["1"]}
                expandIconPosition="start"
                expandIcon={({ isActive }) => (
                  <RightOutlined
                    className="projcollaspe-ico"
                    rotate={isActive ? 90 : 0}
                    style={{
                      fontSize: "16px",
                      position: "absolute",
                      top: "50%", // Position the icon at the vertical center
                      transform: "translateY(-50%)", // Adjust for half of its height}}  />} //, marginTop: '80px'
                    }}
                  />
                )}
                items={[
                  {
                    key: { index },
                    label: (
                      <div
                        className="projcollaspe-head"
                        onClick={() => {
                          window.location.href = `/myproject/${project[0]}/${project[5]}`;
                        }}
                      >
                        <h3 className="projname">
                          Project name: {project[0]}
                          <pre style={{ color: "grey" }}>
                            {project[1]} <br />
                            {project[3] === project[4] ? (
                              <p style={{ color: "red" }}>scanning...</p>
                            ) : (
                              <>
                                Start: ({project[3]}) <br />
                                Complete: ({project[4]})
                                <br />
                                {(() => {
                                  const startDate = new Date(project[3]);
                                  const endDate = new Date(project[4]);
                                  const timeDifference =
                                    endDate.getTime() - startDate.getTime();
                                  const seconds = Math.floor(
                                    timeDifference / 1000
                                  );
                                  const minutes = Math.floor(seconds / 60);
                                  const hours = Math.floor(minutes / 60);
                                  const remainingMinutes = minutes % 60;
                                  const remainingSeconds = seconds % 60;
                                  const timeText = `Time : ${hours} hours: ${remainingMinutes} minutes: ${remainingSeconds} seconds`;
                                  return (
                                    <div>
                                      <IoMdTime
                                        style={{
                                          fontSize: "20px",
                                          color: "#1b317e",
                                        }}
                                      />{" "}
                                      {timeText}
                                    </div>
                                  );
                                })()}
                                <div className="severitybutton-control">
                                  <div className="severitybutton-c">
                                    {" "}
                                    {project[6]}
                                  </div>
                                  <div className="severitybutton-h">
                                    {" "}
                                    {project[7]}
                                  </div>
                                  <div className="severitybutton-m">
                                    {" "}
                                    {project[8]}
                                  </div>
                                  <div className="severitybutton-l">
                                    {" "}
                                    {project[9]}
                                  </div>
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
                        <Link
                          style={{ textAlign: "center" }}
                          className="projedit-btn"
                          to={`/myproject/${project[0]}/${project[5]}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="projcollaspe-content">
                              <p
                                className="projdes"
                                style={{
                                  fontSize: "15px",
                                  color: "grey",
                                  marginTop: "0px",
                                  whiteSpace: "pre-line",
                                  maxWidth: "1000px",
                                }}
                              >
                                {project[2]}
                              </p>
                            </div>
                            
                          </div>
                        </Link>
                      </div>
                    ),
                    extra: (
                      <div className="projcollaspe-extra">
                        <Link
                          to={`/myproject/edit/${project[0]}/${project[5]}`}
                          // className="projedit-btn"
                          // style={{ marginLeft: "650px" }}
                        >
                          <FormOutlined
                            style={{ fontSize: "15px", color: "grey" }}
                          />
                        </Link>
                        <Button
                          type="link"
                          icon={
                            <CloseOutlined
                              className="close-button"
                              style={{
                                fontSize: "15px",
                                color: "red",
                                position: "absolute",
                                right: "10px",
                                top: "50%", // Position the button at the vertical center
                                transform: "translateY(-50%)", // Adjust for half of its height
                              }}
                              onClick={() => Deleteprojuct(project[5])}
                            />
                          }
                        />
                      </div>
                    ),
                  },
                ]}
              ></Collapse>
            </div>
          ))}
      </Card>
      {/* <div className="spaceUp" ></div> */}
    </div>
  );
};

export default Home;
