import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table,Button,Modal,Form,Input,Space,Card,theme,Collapse,ConfigProvider } from 'antd';
import './URLlist.css'
import {PlusOutlined,ReloadOutlined,CloseOutlined,FormOutlined,RightOutlined,ToTopOutlined,ShareAltOutlined,DoubleLeftOutlined} from '@ant-design/icons';
import { Link} from "react-router-dom";
import { CgDanger } from "react-icons/cg";
import Highlighter from 'react-highlight-words';
import Swal from 'sweetalert2'
import './maindashboard.css';
import PDF from './PDF';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import TextArea from 'antd/es/input/TextArea';
const SQlinject = (props) => {
  // console.log(props.name);
  const project_name =props.id
  const project_name_n = props.name
    const { project_name_id } = useParams();
    const [link_, setLink_] = useState("");
    const [projectOneDataSQL, setprojectOneDataSQL] = useState([]);
    const [projectOneDataXSSSQL, setprojectOneDataXSSSQL] = useState([]);
    const [responsedata, setresponsedata] = useState([]);
    const [responsedata2, setresponsedata2] = useState([]);
    const [responsedata3, setresponsedata3] = useState([]);
    const [traversal,settraversal] = useState([])
    const [httponly,sethttponly] = useState([])
    const [expire,setexpire] = useState([])
    const [samsite,setsamsite] = useState([])
    const [secure,setsecure] = useState([])
    const [server,setserver] = useState([])
    const [web,setwebb] = useState([])
    const [Sensitive,setSensitive] = useState([])
    const [HSTS,setHSTS] = useState([])
    const [Command,setCommand] = useState([])
    const [Issue,setIssue] = useState([])
    const [url_target,seturl_target] = useState([])
    const [Details,setDetails] = useState([])
    const [isModalOpenShare, setIsModalOpenShare] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const [isModalOpen4, setIsModalOpen4] = useState(false);
    const [isModalOpen5, setIsModalOpen5] = useState(false);
    const [isModalOpen6, setIsModalOpen6] = useState(false);
    const [isModalOpen7, setIsModalOpen7] = useState(false);
    const [isModalOpen8, setIsModalOpen8] = useState(false);
    const [isModalOpen9, setIsModalOpen9] = useState(false);
    const [isModalOpen10, setIsModalOpen10] = useState(false);
    const [isModalOpen11, setIsModalOpen11] = useState(false);
    const [isModalOpen12, setIsModalOpen12] = useState(false);
    const [Delete,setDelete] = useState("")
    const [updatedSeverities, setUpdatedSeverities] = useState({});
    const [urls,setUrls] = useState([])
    const [EVIDENCE,setEVIDENCE] = useState([])
    const [parameter,setparameter]= useState([])
    const [Risk,setRisk] = useState([])
    const [severitySQL,SetseveritySQL] = useState([]);
    const [severityXSS,SetseverityXSS] = useState([]);
    const [severityTraval,SetseverityTraval] = useState([]);
    const [severitySecure,SetseveritySecure] = useState([]);
    const [severityhttponly,Setseverityhttponly] = useState([]);
    const [severitywebb,Setseveritywebb] = useState([]);
    const [severityexpire,Setseverityexpire] = useState([]);
    const [severitysamsite,Setseveritysamsite] = useState([]);
    const [severityHSTS,SetseverityHSTS] = useState([]);
    const [severitycommand,Setseveritycommand] = useState([]);
    const [severitysensitive,Setseveritysensitive] = useState([]);
    const [severityserver,Setseverityserver] = useState([]);
    const [OID, setOID] = useState('');
    const [Recommendation,setRecommendation]= useState([])
    const [showZero, setShowZero] = useState(false);
    const [usershare,setUershare] = useState([])
    const user = localStorage.user;
    const location = useLocation();
    const tokenuser = localStorage.getItem("token");
    const token = new URLSearchParams(location.search).get('Share');
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/edit-issue?Share=${token}`, {
          headers: {
            'Authorization': `Bearer ${tokenuser}`,
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'
          }
        })

        setDelete(response.data[5].Role);
        seturl_target(response.data[1].url_target[0][0]);
        setDetails(response.data[1].url_target[0][1]);

        if(response.data[2].select_att_sql_DATA[1].length !==0 ){
          SetseveritySQL(response.data[2].select_att_sql_DATA[1][0][0])
            console.log(response.data[2].select_att_sql_DATA[1][0][0])
        }
        const Index = response.data[2].select_att_sql_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              let decodedURL1 = decodeURIComponent(data[1]);
              let decodedURL2 = decodeURIComponent(data[2]);
              return [index + 1, decodedURL, decodedURL1, decodedURL2, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], data[2], ...data];
            }
          })
          .filter(item => item !== null);
  

          
        if(response.data[3].select_att_ID_xsssql_DATA[1].length !==0 ){
          SetseverityXSS(response.data[3].select_att_ID_xsssql_DATA[1][0][0])
            console.log(response.data[3].select_att_ID_xsssql_DATA[1][0][0])
        }
        const IndexXss = response.data[3].select_att_ID_xsssql_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              let decodedURL1 = decodeURIComponent(data[1]);
              let decodedURL2 = decodeURIComponent(data[2]);
              return [index + 1, decodedURL, decodedURL1, decodedURL2, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return null;
            }
          })
          .filter(item => item !== null);


          if(response.data[4].select_att_ID_select_att_traversal_DATA[1].length !==0 ){
            SetseverityTraval(response.data[4].select_att_ID_select_att_traversal_DATA[1][0][0])
              console.log(response.data[4].select_att_ID_select_att_traversal_DATA[1][0][0])
          } 
        const Indextraversal = response.data[4].select_att_ID_select_att_traversal_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              let decodedURL1 = decodeURIComponent(data[1]);
              let decodedURL2 = decodeURIComponent(data[2]);
              return [index + 1, decodedURL, decodedURL1, decodedURL2, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], data[2], ...data];
            }
          })
          .filter(item => item !== null);



          if(response.data[6].select_att_ID_select_att_secure_DATA[1].length !==0 ){
            SetseveritySecure(response.data[6].select_att_ID_select_att_secure_DATA[1][0][0])
              console.log(response.data[6].select_att_ID_select_att_secure_DATA[1][0][0])
          } 
        const IndexSecure = response.data[6].select_att_ID_select_att_secure_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              return [index + 1, decodedURL, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], ...data];
            }
          })
          .filter(item => item !== null);
  

          if(response.data[7].select_att_ID_select_att_httponly_DATA[1].length !==0 ){
            Setseverityhttponly(response.data[7].select_att_ID_select_att_httponly_DATA[1][0][0])
              console.log(response.data[7].select_att_ID_select_att_httponly_DATA[1][0][0])
          } 
        const httponly = response.data[7].select_att_ID_select_att_httponly_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              return [index + 1, decodedURL, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], ...data];
            }
          })
          .filter(item => item !== null);
          if(response.data[8].select_att_ID_select_att_expire_DATA[1].length !==0 ){
            Setseverityexpire(response.data[8].select_att_ID_select_att_expire_DATA[1][0][0])
              console.log(response.data[8].select_att_ID_select_att_expire_DATA[1][0][0])
          }   
        const expire = response.data[8].select_att_ID_select_att_expire_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              return [index + 1, decodedURL, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], ...data];
            }
          })
          .filter(item => item !== null);
  

          if(response.data[9].select_att_ID_select_att_samsite_DATA[1].length !==0 ){
            Setseveritysamsite(response.data[9].select_att_ID_select_att_samsite_DATA[1][0][0])
              console.log(response.data[9].select_att_ID_select_att_samsite_DATA[1][0][0])
          }   
        const samsite = response.data[9].select_att_ID_select_att_samsite_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              return [index + 1, decodedURL, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], ...data];
            }
          })
          .filter(item => item !== null);
  

          if(response.data[10].select_att_ID_select_att_server_DATA[1].length !==0 ){
            Setseverityserver(response.data[10].select_att_ID_select_att_server_DATA[1][0][0])
              console.log(response.data[10].select_att_ID_select_att_server_DATA[1][0][0])
          }   
        const server = response.data[10].select_att_ID_select_att_server_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              return [index + 1, decodedURL, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], ...data];
            }
          })
          .filter(item => item !== null);
  

          if(response.data[11].select_att_ID_select_att_HSTS_DATA[1].length !==0 ){
            SetseverityHSTS(response.data[11].select_att_ID_select_att_HSTS_DATA[1][0][0])
              console.log(response.data[11].select_att_ID_select_att_HSTS_DATA[1][0][0])
          } 
        const HSTS = response.data[11].select_att_ID_select_att_HSTS_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              return [index + 1, decodedURL, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], ...data];
            }
          })
          .filter(item => item !== null);
  


          if(response.data[13].select_att_ID_sensitive[1].length !==0 ){
            Setseveritysensitive(response.data[13].select_att_ID_sensitive[1][0][0])
              console.log(response.data[13].select_att_ID_sensitive[1][0][0])
          } 
        const Sensitive = response.data[13].select_att_ID_sensitive[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              let decodedURL1 = decodeURIComponent(data[1]);
              let decodedURL2 = decodeURIComponent(data[2]);
              return [index + 1, decodedURL, decodedURL1, decodedURL2, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return null;
            }
          })
          .filter(item => item !== null);
  

          if(response.data[14].select_att_ID_webb[1].length !==0 ){
            Setseveritywebb(response.data[14].select_att_ID_webb[1][0][0])
              console.log(response.data[14].select_att_ID_webb[1][0][0])
          } 
        const web = response.data[14].select_att_ID_webb[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              return [index + 1, decodedURL, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return [index + 1, data[0], ...data];
            }
          })
          .filter(item => item !== null);
  

          if(response.data[15].select_att_ID_command_DATA[1].length !==0 ){
            Setseveritycommand(response.data[15].select_att_ID_command_DATA[1][0][0])
              console.log(response.data[15].select_att_ID_command_DATA[1][0][0])
          } 
        const Command = response.data[15].select_att_ID_command_DATA[0]
          .map((data, index) => {
            try {
              let decodedURL = decodeURIComponent(data[0]);
              let decodedURL1 = decodeURIComponent(data[1]);
              let decodedURL2 = decodeURIComponent(data[2]);
              return [index + 1, decodedURL, decodedURL1, decodedURL2, ...data];
            } catch (error) {
              console.error("Error decoding URL:", error);
              return null;
            }
          })
          .filter(item => item !== null);

          
          setHSTS(HSTS);
          setwebb(web);
          setsamsite(samsite);
          setserver(server);
          setexpire(expire);
          sethttponly(httponly);
          setsecure(IndexSecure);
          setprojectOneDataXSSSQL(IndexXss);
          setprojectOneDataSQL(Index);
          settraversal(Indextraversal);
          setSensitive(Sensitive);
          setCommand(Command);
            setresponsedata2([
              {"SQL Injection": Index},
              {"Reflected Cross Site Scripting": IndexXss},
              {"Directory Traversal File Include": Indextraversal},
              {"Missing Secure Attribute in Cookie Header": IndexSecure},
              {"Missing HttpOnly Attribute in Cookie Header": httponly},
              {"Missing Expires Attribute in Cookie Header": expire},
              {"Missing SameSite Attribute in Cookie Header": samsite},
              {"Web Server Information Leakage through Server header": server},
              {"Missing HTTP Strict Transport Security Header": HSTS},
              {"Web Application Framework Information Leakage": web},
              {"Sensitive File Disclosure": Sensitive},
              {"Command Injection": Command},
            ]);
            if (responsedata2 && responsedata2.length > 0) {
              console.log("Updated responsedata2:", responsedata2);
              responsedata2.sort((a, b) => {
                const lengthA = a[Object.keys(a)[0]].length;
                const lengthB = b[Object.keys(b)[0]].length;
                return lengthB - lengthA;
              });
              console.log("Sorted responsedata2:", responsedata2);
          };
            console.log(response)
            console.log("Original responsedata2:", responsedata2);

        
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
  if (responsedata2 && responsedata2.length > 0) {
    console.log("Updated responsedata2:", responsedata2);
    responsedata2.sort((a, b) => {
      const lengthA = a[Object.keys(a)[0]].length;
      const lengthB = b[Object.keys(b)[0]].length;
      return lengthB - lengthA;
    });
setresponsedata3(responsedata2)
    console.log("Sorted responsedata2:", responsedata2);
    
  }
}, [responsedata2]);

    useEffect(() => {
      fetchData();
    }, [project_name_id]);
  
    function isURL(input) {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      return urlRegex.test(input);
    }
    

    

    const Formsummit = async () => {
        if (!isURL(urls)) {
      return Swal.fire({
        title: "url Error",
        text: "url Error",
        icon: "error",
      });
  }
  if (!EVIDENCE.trim()) {
    Swal.fire({
      title: "EVIDENCE",
      text: "Please enter EVIDENCE",
      icon: "error",
    });
  } 
      try {
        await         axios
        .post(`http://127.0.0.1:5000/addIssueedit`,{urls,EVIDENCE,Risk,Recommendation,OID,token},
        {
          headers:{
              Authorization: `Bearer ${tokenuser}`,
              'Access-Control-Allow-Origin' : '*',
              'Content-Type': 'application/json'
          },

      })
          setUrls([]);
          setEVIDENCE([]);
          setRisk([]);
          setRecommendation([]);
          setOID('');
        await fetchData();
      } catch (err) {
        alert(err.response.data);
      }
  
      setIsModalOpen1(false);
      setIsModalOpen2(false);
      setIsModalOpen3(false);
      setIsModalOpen4(false);
      setIsModalOpen5(false);
      setIsModalOpen6(false);
      setIsModalOpen7(false);
      setIsModalOpen8(false);
      setIsModalOpen10(false);
      setIsModalOpen11(false);
      setIsModalOpen9(false);
      setIsModalOpen12(false);
    };
    const showModal = (OID) => {
      setOID(OID);
      if (OID === 1) {
        setIsModalOpen1(true);
      } else if (OID === 2) {
        setIsModalOpen2(true);
      }
      else if (OID === 3) {
        setIsModalOpen3(true);
      }
      else if (OID === 4) {
        setIsModalOpen4(true);
      }
      else if (OID === 5) {
        setIsModalOpen5(true);
      }
      else if (OID === 6) {
        setIsModalOpen6(true);
      }
      else if (OID === 7) {
        setIsModalOpen8(true);
      }
      else if (OID === 8) {
        setIsModalOpen8(true);
      }
      else if (OID ===9) {
        setIsModalOpen9(true);
      }

      else if (OID === 10) {
        setIsModalOpen10(true);
      }
      else if (OID ===11) {
        setIsModalOpen11(true);
      }
      else if (OID ===12) {
        setIsModalOpen12(true);
      }



    };
    //   const handleOk = () => {
    //     setIsModalOpen(false);
    //   };


      const handleCancel = () => {
        setIsModalOpen1(false);
        setIsModalOpen2(false);
        setIsModalOpen3(false);
        setIsModalOpen4(false);
        setIsModalOpen5(false);
        setIsModalOpen6(false);
        setIsModalOpen7(false);
        setIsModalOpen8(false);
        setIsModalOpen10(false);
        setIsModalOpen11(false);
        setIsModalOpen9(false);
        setIsModalOpen12(false);
      };
    



    const handleSeverityChange = (e, index, vulnerability) => {
      console.log("e, index, vulnerability",e, index, vulnerability)
      const newUpdatedSeverities = { ...updatedSeverities };
      newUpdatedSeverities[index] = e.target.value;
      setUpdatedSeverities(newUpdatedSeverities);
    };


    const handleShowZero = () => {
      setShowZero(!showZero);
    };
  
    const handleConfirmButtonClick = async (vulnerability, selectedSeverity) => {
      if (selectedSeverity) {
        try {
          const result = await Swal.fire({
            title: 'Are you Sure?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
          });
  
          if (result.isConfirmed) {
            await sendSeverityToAPI(vulnerability, selectedSeverity);
          } else {
            setUpdatedSeverities({ ...updatedSeverities });
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Choices',
        });
      }
    };
    const sendSeverityToAPI = async (vulnerability, newSeverity) => {
      try {
        await axios.put(
          `http://127.0.0.1:5000/editupdateSeverityURL`,
          {
            token,
            vulnerability,
            newSeverity,
          },
          {
            headers: {
              Authorization:`Bearer ${tokenuser}`,
              'Access-Control-Allow-Origin' : '*',
              'Content-Type': 'application/json'
            },
          }
        );
      await fetchData();
      } catch (error) {
        console.error(error);
      }
    };

    const getColorForSeverity = (severity) => {
      switch (severity) {
        case 'Low':
          return '#6F77B1';
        case 'Medium':
          return '#FFBB28';
        case 'High':
          return '#FF5100';
          case 'Critical':
            return '#FF0000';
        default:
          return '#a7ffb9';
      }
    };
  

    
    const refreshData = () => {
       window.location.reload();
      };

      const handleDelete = async (iddelete) => {
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
          });
    
          if (result.isConfirmed) {
            await    axios.delete(`http://127.0.0.1:5000/EditoneVulsdelete?project_name_id=${token}&record=${iddelete}`,{
              headers:{
                Authorization:`Bearer ${tokenuser}`,
                'Access-Control-Allow-Origin' : '*',
                'Content-Type': 'application/json'
              },
            });
            await fetchData();
            // setserver(server.filter((project=>project[7] !==iddelete )))
            // setprojectOneDataSQL(projectOneDataSQL.filter((project=>project[10] !==iddelete)))
            // setprojectOneDataXSSSQL(projectOneDataXSSSQL.filter((project=>project[10] !==iddelete)));
            // settraversal(traversal.filter((project=> project[10]!==iddelete)))
            // setHSTS(HSTS.filter((project=>project[7] !==iddelete )))     
            // setsamsite(samsite.filter((project=>project[7] !==iddelete )))
            // setserver(server.filter((project=>project[7] !==iddelete )))
            // setexpire(expire.filter((project=>project[7] !==iddelete )))
            // sethttponly(httponly.filter((project=>project[7] !==iddelete )))
            // setsecure(secure.filter((project=>project[7] !==iddelete )))
            // setwebb(web.filter((project=>project[7] !==iddelete )))
            // setCommand(Command.filter((project=>project[10] !==iddelete)));
            
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success',
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      const showModalShare = () => {
        setIsModalOpenShare(true);
      };



    //   const FormsummitShare =()=>{
    //     const project_name = project_name_id
  
  
    //     axios.post(`http://127.0.0.1:5000/generate-link`, { project_name, usershare }, {
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     })
    //     .then(response => {
    //       console.log(response)
    //       setLink_(response.data.link)
    //       if (response.data && response.data.userError) {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'This user does not exist.',
    //         });
    //       }
    //       setUershare([])
    //     })
        
    //     .catch(err=>{
    //         alert(err.response.data)
    //     })   
    //     setIsModalOpenShare(false);   
    // }
  

    const handleCopy = () => {
      navigator.clipboard.writeText(link_).then(() => {
        alert("Copy successful");
      }).catch((error) => {
        console.error('Unable to copy link', error);
      });
    };
    

      const memoizedPDF = useMemo(() => {
        return <PDF id={project_name} name={project_name_n} url_target={url_target} Details={Details} responsedata={responsedata3}></PDF>;
      }, [responsedata3]);
      // console.log('Res2',responsedata2)  
      // console.log('Res3',responsedata3) 
      return (
        <div>
          <div className="button-container">
            
          {Delete === "Advance" && (
            <div>


              {/* {link_ && (
                <div>
                  <p>{link_}</p>
                  <Button type="primary" style={{ transform: 'translateX(850px) scale(0.8)', marginTop: '20px' }} onClick={handleCopy}>
                    Copy Link
                  </Button>
                </div>
              )}    
                     
                <Button onClick={showModalShare} type="primary" shape="round" icon={<ShareAltOutlined />}  style={{ marginRight: "10px" }}>
                Share
              </Button>
            <Modal title="SHARE" open={isModalOpenShare} onOk={FormsummitShare} onCancel={handleCancel}>
              <Form className='input-container'
                onFinish={FormsummitShare}
                labelCol={{
                  span: 5,
                }}
              >
                user:<Input type="text" style={{ marginRight:"20px" }} className="forminput-control" value={usershare} onChange={(e) => setUershare(e.target.value)} /> <br/>
              </Form>
            </Modal> */}
                {/* <Button type="primary" shape="round" icon={<ShareAltOutlined />} style={{ marginRight: "10px" }}>
                  Share
                </Button> */}
            </div>
          )}
          {/* <Button type="primary" shape="round" icon={<ToTopOutlined />}>
            Export as PDF
          </Button> */}
          {memoizedPDF}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {responsedata3.map((item, index) => {
            const itemCount = item[Object.keys(item)[0]].length;
    
            return (
                 <div key={index} style={{ marginBottom: '10px', display: 'block', flex: '0 0 100%', maxWidth: '100%' }}>
            {(itemCount > 0 || showZero) && (
                  <div key={index} style={{ marginBottom: '10px', display: 'block', flex: '0 0 100%', maxWidth: '100%' }}>
                    <Collapse
                      className="projcollaspe"
                      collapsible="header"                size="small"
                      defaultActiveKey={['1']}
                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                      expandIcon={({ isActive }) => (
                        <>
                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                        </>
                      )}
                      items={[
                        {
                          label: (
                            <>
                              {Object.keys(item)[0] === "Sensitive File Disclosure" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severitysensitive) }}
                                      onClick={() => showModal(7)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Sensitive File Disclosure"
                                    open={isModalOpen7}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
                                {Object.keys(item)[0] === "SQL Injection" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severitySQL) }}
                                      onClick={() => showModal(11)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL SQL Injection"
                                    open={isModalOpen11}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
                              {Object.keys(item)[0] === "Reflected Cross Site Scripting" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severityXSS) }}
                                      onClick={() => showModal(10)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Reflected Cross Site Scripting"
                                    open={isModalOpen10}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      
                                {Object.keys(item)[0] === "Directory Traversal File Include" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severityTraval) }}
                                      onClick={() => showModal(4)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Directory Traversal File Include"
                                    open={isModalOpen4}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      
                            {Object.keys(item)[0] === "Command Injection" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]}  ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severitycommand) }}
                                      onClick={() => showModal(12)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Command Injection"
                                    open={isModalOpen12}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      
      
                                {Object.keys(item)[0] === "Missing Secure Attribute in Cookie Header" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severitySecure) }}
                                      onClick={() => showModal(2)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Missing Secure Attribute in Cookie Header"
                                    open={isModalOpen2}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
        
      
      
      {Object.keys(item)[0] === "Missing SameSite Attribute in Cookie Header" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severitysamsite) }}
                                      onClick={() => showModal(6)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Missing SameSite Attribute in Cookie Header"
                                    open={isModalOpen6}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      {Object.keys(item)[0] === "Missing HttpOnly Attribute in Cookie Header" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]}  ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severityhttponly) }}
                                      onClick={() => showModal(3)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Missing HttpOnly Attribute in Cookie Header"
                                    open={isModalOpen3}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      
      
      {Object.keys(item)[0] === "Missing Expires Attribute in Cookie Header" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severityexpire) }}
                                      onClick={() => showModal(5)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Missing Expires Attribute in Cookie Header"
                                    open={isModalOpen5}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      {Object.keys(item)[0] === "Web Server Information Leakage through Server header" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]} ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severityserver) }}
                                      onClick={() => showModal(1)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Missing Expires Attribute in Cookie Header"
                                    open={isModalOpen1}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      
      {Object.keys(item)[0] === "Web Application Framework Information Leakage" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]}  ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severitywebb) }}
                                      onClick={() => showModal(9)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Missing Expires Attribute in Cookie Header"
                                    open={isModalOpen9}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
      
      
      
      
      
      
      
      
      
                              {Object.keys(item)[0] === "Missing HTTP Strict Transport Security Header" && (
                                <div className="projcollaspe-head">
                                  <h3 className="projname">
                                    {Object.keys(item)[0]}  ({item[Object.keys(item)[0]].length})
                                  </h3>
                                  {Delete === 'Advance' && (
                                    <Button
                                      style={{ background: getColorForSeverity(severityHSTS) }}
                                      onClick={() => showModal(8)}
                                      type="primary"
                                      icon={<PlusOutlined />}
                                    >
                                      Add to URL Issue
                                    </Button>
                                  )}
                                  <Modal
                                    title="Add URL Missing HTTP Strict Transport Security Header"
                                    open={isModalOpen8}
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
                                      URL:
                                      <Input
                                        type="url"
                                        className="forminput-control"
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                      />{" "}
                                      <br />
                                      EVIDENCE:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={EVIDENCE}
                                        onChange={(e) => setEVIDENCE(e.target.value)}
                                      />
                                      <br />
                                      {/* Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/> */}
                                      Risk Description:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Risk}
                                        onChange={(e) => setRisk(e.target.value)}
                                      />
                                      <br />
                                      Recommendation:
                                      <TextArea
                                        type="text"
                                        className="forminput-control"
                                        value={Recommendation}
                                        onChange={(e) => setRecommendation(e.target.value)}
                                      />
                                    </Form>
                                  </Modal>
                                </div>
                              )}
                            </>
                          ),
      
      
                          
                          children: (
                            <>
                              {Object.keys(item)[0] === "Sensitive File Disclosure" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[3]} target="_blank" rel="noopener noreferrer">
                                                {OneData[3]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[10])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                            <td style={{textAlign:"center"}}>
                                      <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                        {OneData[1]}
                                      </a>
                                    </td>
                                    <td style={{textAlign:"center",color:"red"}}>{OneData[2]}</td>
                            </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[7]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[8]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[11]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[12]) }}
                              value={updatedSeverities[index] || OneData[12]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[10])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[10], updatedSeverities[index] || OneData[12])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
                                {Object.keys(item)[0] === "SQL Injection" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[3]} target="_blank" rel="noopener noreferrer">
                                                {OneData[3]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[10])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                            <td style={{textAlign:"center"}}>
                                      <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                        {OneData[1]}
                                      </a>
                                    </td>
                                    <td style={{textAlign:"center",color:"red"}}>{OneData[2]}</td>
                            </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[7]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[8]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[11]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[12]) }}
                              value={updatedSeverities[index] || OneData[12]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[10])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[10], updatedSeverities[index] || OneData[12])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
      {Object.keys(item)[0] === "Reflected Cross Site Scripting" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[3]} target="_blank" rel="noopener noreferrer">
                                                {OneData[3]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[10])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                            <td style={{textAlign:"center"}}>
                                      <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                        {OneData[1]}
                                      </a>
                                    </td>
                                    <td style={{textAlign:"center",color:"red"}}>{OneData[2]}</td>
                            </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[7]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[8]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[11]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[12]) }}
                              value={updatedSeverities[index] || OneData[12]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[10])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[10], updatedSeverities[index] || OneData[12])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
      
      {Object.keys(item)[0] === "Directory Traversal File Include" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[3]} target="_blank" rel="noopener noreferrer">
                                                {OneData[3]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[10])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                            <td style={{textAlign:"center"}}>
                                      <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                        {OneData[1]}
                                      </a>
                                    </td>
                                    <td style={{textAlign:"center",color:"red"}}>{OneData[2]}</td>
                            </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[7]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[8]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[11]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[12]) }}
                              value={updatedSeverities[index] || OneData[12]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[10])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[10], updatedSeverities[index] || OneData[12])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      {Object.keys(item)[0] === "Command Injection" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[3]} target="_blank" rel="noopener noreferrer">
                                                {OneData[3]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[10])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                            <td style={{textAlign:"center"}}>
                                      <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                        {OneData[1]}
                                      </a>
                                    </td>
                                    <td style={{textAlign:"center",color:"red"}}>{OneData[2]}</td>
                            </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[7]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[8]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[11]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[12]) }}
                              value={updatedSeverities[index] || OneData[12]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[10])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[10], updatedSeverities[index] || OneData[12])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
                              
      
      
      
      
                               {Object.keys(item)[0] === "Missing HTTP Strict Transport Security Header" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                {OneData[1]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[7])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                <td style={{textAlign:"center"}}>
                                                          <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                            {OneData[1]}
                                                          </a>
                                                        </td>
                                                        <td style={{ textAlign: "center", color: "red" }}>
                                              {/* <Highlighter
                                              style={{color:"red"}}
                                                highlightClassName="YourHighlightClass"
                                                searchWords={['Set-Cookie']} 
                                                autoEscape={true}
                                                textToHighlight={OneData[3]||OneData[8]}
                                              /> */}
                                                  <p>{OneData[3]||OneData[8]}</p>
                                          </td>
                                                </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[4]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[5]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[6]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[10]) }}
                              value={updatedSeverities[index] || OneData[10]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[7])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[7], updatedSeverities[index] || OneData[10])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      {Object.keys(item)[0] === "Missing Secure Attribute in Cookie Header" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                {OneData[1]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[7])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                <td style={{textAlign:"center"}}>
                                                          <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                            {OneData[1]}
                                                          </a>
                                                        </td>
                                                        <td style={{ textAlign: "center", color: "red" }}>
                                              {/* <Highlighter
                                              style={{color:"red"}}
                                                highlightClassName="YourHighlightClass"
                                                searchWords={['Set-Cookie']} 
                                                autoEscape={true}
                                                textToHighlight={OneData[3]||OneData[8]}
                                              /> */}
                                                  <p>{OneData[3]||OneData[8]}</p>
                                          </td>
                                                </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[4]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[5]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[6]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[10]) }}
                              value={updatedSeverities[index] || OneData[10]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[7])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[7], updatedSeverities[index] || OneData[10])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
      {Object.keys(item)[0] === "Web Server Information Leakage through Server header" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                {OneData[1]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[7])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                <td style={{textAlign:"center"}}>
                                                          <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                            {OneData[1]}
                                                          </a>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
      
                                                        <Highlighter
                                                        style={{color:"red"}}
                                                          highlightClassName="YourHighlightClass"
                                                          searchWords={['Server', 'openresty','Apache','Nginx',' Microsoft IIS','LiteSpeed','Caddy','Tomcat','lighttpd','Cherokee','Jetty','imunify360-webshield']}
                                                          autoEscape={true}
                                                          textToHighlight={OneData[3]||OneData[8]}
                                                        />
      
                                                        </td>
                                                </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[4]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[5]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[6]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[10]) }}
                              value={updatedSeverities[index] || OneData[10]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[7])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[7], updatedSeverities[index] || OneData[10])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
      {Object.keys(item)[0] === "Web Application Framework Information Leakage" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                {OneData[1]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[7])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                <td style={{textAlign:"center"}}>
                                                          <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                            {OneData[1]}
                                                          </a>
                                                        </td>
                                                        <td style={{ textAlign: "center", color: "red" }}>
          <Highlighter
           style={{color:"red"}}
            highlightClassName="YourHighlightClass"
            searchWords={[
              "Express",
              "Django",
              "Phusion Passenger",
              "Flask",
              "ASP.NET",
              "SpringBoot",
              "FastAPI",
              "Laravel",
              "Play Framework",
              "Meteor",
              "NestJS",
              "CherryPy",
              "Mono",
              "Blood, sweat and tears",
              "Swiftlet",
              "X-Powered-By",
              "X-Generator",
              "WoltLab",
              "XenForo",
              "vBulletin",
              "MyBB",
              "OpenCart",
              "Shopify",
              "Magento",
              "PrestaShop",
              "Joomla",
              "MediaWiki",
              "SMF",
              "wcf_user",
              "xf_user",
              "vb_session",
              "mybb",
              "oc_sessionPassphrase",
              "_secure_session_id",
              "frontend",
              "adminhtml",
              "PrestaShop-[some_numeric_value]",
              "joomla_user_state",
              "wiki_session",
              "SMFCookie[numeric_value]",
              "zope",
              "cakephp",
              "kohanasession",
              "laravel_session",
              "phpbb3_",
              "wp-settings",
              "BITRIX_",
              "AMP",
              "django",
              "DotNetNukeAnonymous",
              "e107_tz",
              "EPiTrace",
              "EPiServer",
              "graffitibot",
              "hotaru_mobile",
              "ICMSession",
              "MAKACSESSION",
              "InstantCMS[logdate]",
              "CMSPreferredCulture",
              "SN4[12symb]",
              "fe_typo_user",
              "Dynamicweb",
              "lep[some_numeric_value]+sessionid",
              "Domain=.wix.com",
              "VivvoSessionId",
              "<flask",
              "{% extends \"base.html\" %}",
              "<spring",
              "<th:include",
              "@extends",
              "@section",
              "@yield",
              "<ng-app",
              "<ng-controller",
              "<ng-repeat",
              "<ng-if",
              "<div data-reactroot",
              "<div data-reactid",
              "<ng-app",
              "<ng-controller",
              "<div v-bind",
              "<input v-model",
              "<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>",
              "{% extends",
              "{% block",
              "<ng-app",
              "<ng-controller",
              "<ng-repeat",
              "<ng-if",
              "<div v-bind",
              "<input v-model",
              "<ul v-for",
              "<li v-for",
              "<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>",
              "<script src=\"/path/to/jquery.js\"></script>",
              "{% block",
              "{% include",
              "{% for",
              "<%= render",
              "<%= link_to",
              "<%= form_for",
              ""
            ]} 
            autoEscape={true}
            textToHighlight={OneData[3]||OneData[8]}
          />
              {/* <p>{OneData[3]||OneData[8]}</p> */}
      </td>
                                                </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[4]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[5]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[6]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[10]) }}
                              value={updatedSeverities[index] || OneData[10]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[7])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[7], updatedSeverities[index] || OneData[10])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      {Object.keys(item)[0] === "Missing SameSite Attribute in Cookie Header" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                {OneData[1]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[7])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                <td style={{textAlign:"center"}}>
                                                          <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                            {OneData[1]}
                                                          </a>
                                                        </td>
                                                        <td style={{ textAlign: "center", color: "red" }}>
                                              {/* <Highlighter
                                              style={{color:"red"}}
                                                highlightClassName="YourHighlightClass"
                                                searchWords={['Set-Cookie']} 
                                                autoEscape={true}
                                                textToHighlight={OneData[3]||OneData[8]}
                                              /> */}
                                                  <p>{OneData[3]||OneData[8]}</p>
                                          </td>
                                                </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[4]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[5]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[6]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[10]) }}
                              value={updatedSeverities[index] || OneData[10]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[7])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[7], updatedSeverities[index] || OneData[10])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
      {Object.keys(item)[0] === "Missing HttpOnly Attribute in Cookie Header" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                {OneData[1]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[7])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                <td style={{textAlign:"center"}}>
                                                          <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                            {OneData[1]}
                                                          </a>
                                                        </td>
                                                        <td style={{ textAlign: "center", color: "red" }}>
                                              {/* <Highlighter
                                              style={{color:"red"}}
                                                highlightClassName="YourHighlightClass"
                                                searchWords={['Set-Cookie']} 
                                                autoEscape={true}
                                                textToHighlight={OneData[3]||OneData[8]}
                                              /> */}
                                                  <p>{OneData[3]||OneData[8]}</p>
                                          </td>
                                                </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[4]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[5]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[6]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[10]) }}
                              value={updatedSeverities[index] || OneData[10]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[7])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[7], updatedSeverities[index] || OneData[10])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      {Object.keys(item)[0] === "Missing Expires Attribute in Cookie Header" && (
                                <>
                                  {item[Object.keys(item)[0]].map((OneData, dataIndex) => (
                                    <Collapse
                                      key={`${index}-${dataIndex}`}
                                      className="projcollaspe"
                                      collapsible="header"
                                      size="small"
                                      defaultActiveKey={[`${index}-${dataIndex}`]}
                                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                                      expandIcon={({ isActive }) => (
                                        <>
                                          <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
                                        </>
                                      )}
                                      items={[
                                        {
                                          label: (
                                            <div className="projcollaspe-head">
                                              <a style={{ color: 'red' }} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                {OneData[1]}
                                              </a>
                                              {Delete === 'Advance' && (
                                                <Space size="middle">
                                                  <Button
                                                    type="danger"
                                                    icon={<CloseOutlined className="close-button" style={{ color: 'red', marginBottom: '20px' }} />}
                                                    onClick={() => handleDelete(OneData[7])}
                                                  ></Button>
                                                </Space>
                                              )}
                                            </div>
                                          ),
                                          children: (
                                            
                                            <div className="collapse-content" style={{ overflow: 'auto' }}>
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>URL</th>
                                                    <th>EVIDENCE</th>                                                           
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                <td style={{textAlign:"center"}}>
                                                          <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                                                            {OneData[1]}
                                                          </a>
                                                        </td>
                                                        <td style={{ textAlign: "center", color: "red" }}>
                                              {/* <Highlighter
                                              style={{color:"red"}}
                                                highlightClassName="YourHighlightClass"
                                                searchWords={['Set-Cookie']} 
                                                autoEscape={true}
                                                textToHighlight={OneData[3]||OneData[8]}
                                              /> */}
                                                  <p>{OneData[3]||OneData[8]}</p>
                                          </td>
                                                </tr>
                            <tr>
                            <td colSpan="2"  style={{ textAlign: 'left'}}>
                                <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
                                <p> {OneData[4]}</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
                                <p>
                                {OneData[5]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>References:</strong>
                                <p>
                                {OneData[9]}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>WSTG-ID:</strong>
                                <p>
                                {OneData[6]}
                                </p>
                              </td>
                            </tr>
                            <tr key={index}>
                            <td colSpan="2"  style={{ textAlign: 'left' }}>
                                <strong  style={{fontSize:"16px"}}>Severity:</strong>
                            <select
                              style={{ color: getColorForSeverity(OneData[10]) }}
                              value={updatedSeverities[index] || OneData[10]}
                              onChange={(e) => handleSeverityChange(e, index, OneData[7])}
                            >
                              <option style={{ color: "#6F77B1" }} value="Low">
                                Low
                              </option>
                              <option style={{ color: "#FFBB28" }} value="Medium">
                                Medium
                              </option>
                              <option style={{ color: "#FF5100" }} value="High">
                                High
                              </option>
                              <option style={{ color: "#FF0000" }} value="Critical">
                              Critical
                              </option>
                            </select>
                            <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(OneData[7], updatedSeverities[index] || OneData[10])}>Confirm</Button>
                          </td>
        </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          ),
                                        },
                                      ]}
                                    />
                                  ))}
                                </>
                              )}
      
      
      
      
      
      
      
      
      
      
                            </>
                          ),                    
                        },
                      ]}
                    />
                  </div>
                )}
              
              </div>
            );


}
)}
<div style={{ transform: 'translateX(930px) translateY(0px)  scale(1)' }}>
<Button  type='link' onClick={handleShowZero}>
        {showZero ? (<div  style={{color:"#006EF0"}} ><DoubleLeftOutlined rotate={90} /> Hide Unfound Vulnerability</div>) : (<div  style={{color:"#006EF0"}} ><DoubleLeftOutlined rotate={270}/> Show Unfound Vulnerability</div>) }
      </Button>
</div>

 
      

    </div>

    </div> 
  );
}

 
    
  
export default SQlinject;