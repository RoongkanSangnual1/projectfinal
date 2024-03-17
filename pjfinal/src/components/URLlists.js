import { useParams,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Space } from "antd";
import "./URLlist.css";
import { PlusOutlined, ReloadOutlined, CloseOutlined,ToTopOutlined } from "@ant-design/icons";
import "./maindashboard.css";
import Swal from "sweetalert2";
import PDF from "./PDF";
import ClipLoader  from "react-spinners/ClipLoader";
import { CSVLink } from "react-csv";
const URLlist = (props) => {
  // console.log(props.name);
  const project_name = props.id;
  const project_name_n = props.name;
  const { project_name_id } = useParams();
  const location = useLocation();
  const [projectOneData, setProjectOneData] = useState([]);
  const [urls, setUrls] = useState([]);
  const [urlsAll, setUrlsAll] = useState([]);
  const [method, setmethod] = useState([]);
  const [parameter, setparameter] = useState([]);
  const [url_target, seturl_target] = useState([]);
  const [Details, setDetails] = useState([]);
  const [Delete, setDelete] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Crawl, setCrawl] = useState([]);
  const [vul, setvul] = useState([]);
  const user = localStorage.user;
  const token = localStorage.getItem("token");



  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/onedata?project_name_id=${project_name_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response);
  
      setDelete(response.data[5].Role);
      seturl_target(response.data[1].url_target[0][0]);
      setDetails(response.data[1].url_target[0][1]);
      setUrlsAll(response.data[0].crawl_data.length)
      setCrawl(response.data[17].State__crawl[0][0]);
      setvul(response.data[12].valueENDpp);
      const Index = response.data[0].crawl_data.map((data, index) => {
        try {
          let decodedURL = decodeURIComponent(data[0]);
          return [index + 1, decodedURL, ...data];
        } catch (error) {
          console.error("Error decoding URL:", error);
          return null;
        }
      }).filter((item) => item !== null);
  
      setProjectOneData(Index);
    } catch (error) {
      console.error(error);
    }
  };
  

        useEffect(()=>{
            fetchData();
          },[])







  const columns = [
    {
      title: "No.",
      dataIndex: "0",
      key: "index",
    },
    {
      title: "URL",
      dataIndex: "1",
      key: "URL",
      render: (text, record) => <a href={record[2]}>{text}</a>,
    },
    {
      title: "METHOD",
      dataIndex: "3",
      key: "METHOD",
    },
    {
      title: "Status",
      dataIndex: "4",
      key: "status",
    },
  ];
  if (Delete === "Advance") {
    columns.push({
      title: "Delete",
      dataIndex: "5",
      key: "delete",
      render: (text, record) => (


        <Space size="middle">
          <Button
            type="danger"
            icon={
              <CloseOutlined
                className="close-button"
                style={{ color: "red" }}
              />
            }
            onClick={() => handleDelete(record[5])}
          >
            {" "}
          </Button>
        </Space>
      ),
    });
  }
  const csvData = [
    ["No.", "URL", "METHOD", "Status"],
    ...projectOneData.map((data) => [
      data[0],  // Index
      data[1],  // URL
      data[3],  // Method
      data[4]   // Status
    ]),
  ];
  const handleDelete = (iddelete) => {

    Swal.fire({


      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {

      if (result.isConfirmed) {
        axios
          .delete(
            `http://127.0.0.1:5000/oneurlsdelete?project_name_id=${project_name_id}&record=${iddelete}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              setProjectOneData((prevData) =>
                prevData.filter((project) => project[5] !== iddelete)
              );



              Swal.fire({
                title: "Deleted!",
                text: "Your URL has been deleted.",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Unable to delete the URL. Please try again.",
                icon: "error",
              });
            }

            fetchData();

            // console.log(response);

          })
          .catch((error) => {
            // Show an error message if there was an error during the delete operation
            Swal.fire({
              title: "Error!",
              text: "An error occurred while deleting the URL.",
              icon: "error",
            });

            // Log the error
            console.log(error);
          });
      }
    });
  };











  const showModal = () => {
    setIsModalOpen(true);
  };
  //   const handleOk = () => {
  //     setIsModalOpen(false);
  //   };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  function isURL(input) {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(input);
  }
  


  const Formsummit = () => {
    if (!isURL(urls)) {
      return Swal.fire({
        title: "url Error",
        text: "url Error",
        icon: "error",
      });
  }

    axios
      .post(
        `http://127.0.0.1:5000/addurls`,
        { urls, method, parameter, project_name_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        alert(err.response.data);
      });
    setIsModalOpen(false);
  };



  const refreshData = async () => {
    const confirmationResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to refresh this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, refresh it!",
    });
  
    if (confirmationResult.isConfirmed) {
      axios
        .delete(
          `http://127.0.0.1:5000/refreshData?project_name_id=${project_name_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
    
          if (response.status === 200) {
            // setProjectOneData((prevData) =>
            //   prevData.filter((project) => project[5] !== iddelete)
            // );
  
            // Swal.fire({
            //   title: "Refresh!",
            //   text: "Your URL has been Refresh.",
            //   icon: "success",
            // })
            // .then(() => {
            // });
          }
        })
        .catch((error) => {
          console.error("Error deleting data: ", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting your URL.",
            icon: "error",
          });
        });
    }
  };

  


  // setCrawl(projectOneData.length)
  // console.log("sd",projectOneData.length);
  console.log(projectOneData)
  return (
    <div>
      <div className="button-container">
      {Crawl === 0 || Crawl === null ? (
  <div style={{ marginRight: '20px' }}>
    <ClipLoader 
      color={"#white"}
      size={30}
      aria-label="Loading Spinner"
      data-testid="loader"
    />  
    <br/>  
    Scanning Url...
  </div>
) : (
  <>
    <div style={{ marginRight: '20px' }}>
      URLS All: {urlsAll} 
    </div>
    {vul === null && (
      <div style={{ marginRight: '450px' }}>
        <ClipLoader 
          color={"#white"}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />  
        <br/>  
        Scanning Vulnerabilities...
      </div>
    )}
  </>
)}
        <Button
          onClick={refreshData}
          icon={<ReloadOutlined />}
          style={{ marginRight: '10px' }}
        >
          rescan
        </Button>
        {Delete === "Advance" && (
          <div>
            <Button onClick={showModal} type="primary" shape="round" icon={<PlusOutlined />} style={{ marginRight: '10px' }}>
              Add to URLs
            </Button>
            <Button type="primary" shape="round" icon={<ToTopOutlined />}>
              <CSVLink filename={`${props.name}-urllist.csv`} data={csvData}>
                Export as CSV
              </CSVLink>
            </Button>
          </div>
        )}
      </div>
      <Modal
        title="Add URL"
        open={isModalOpen}
        onOk={Formsummit}
        onCancel={handleCancel}
      >
        <Form
          className="input-container"
          onFinish={Formsummit}
          labelCol={{
            span: 5,
          }}
        >
          Location:
          <Input
            type="url"
            className="forminput-control"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />{" "}
          <br />
          METHOD:
          <Input
            type="text"
            className="forminput-control"
            value={method}
            onChange={(e) => setmethod(e.target.value)}
          />
          <br />
          Status:
          <Input
            type="text"
            className="forminput-control"
            value={parameter}
            onChange={(e) => setparameter(e.target.value)}
          />
        </Form>
      </Modal>
      <Table dataSource={projectOneData} columns={columns} />
    </div>
  );
};

export default URLlist;