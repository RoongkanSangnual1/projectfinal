// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
// import './Dashboard.css'
// import Swal from 'sweetalert2'
// import ClockLoader from "react-spinners/ClockLoader";
// import { Table,Button,Modal,Form,Input,Space,Card,theme,Collapse,ConfigProvider } from 'antd';
// import {PlusOutlined,ReloadOutlined,CloseOutlined,FormOutlined,RightOutlined} from '@ant-design/icons';

import { useLocation } from 'react-router-dom';

// const EditDashboard = () => {
//   const { project_name_id } = useParams();
//   const [projectOneDataSQL, setProjectOneDataSQL] = useState(0);
//   const [severitySQL,SetseveritySQL] = useState([]);
//   const [severityXSS,SetseverityXSS] = useState([]);
//   const [severityTraval,SetseverityTraval] = useState([]);
//   const [severitySecure,SetseveritySecure] = useState([]);
//   const [severityhttponly,Setseverityhttponly] = useState([]);
//   const [severitywebb,Setseveritywebb] = useState([]);
//   const [severityexpire,Setseverityexpire] = useState([]);
//   const [severitysamsite,Setseveritysamsite] = useState([]);
//   const [severityHSTS,SetseverityHSTS] = useState([]);
//   const [severitycommand,Setseveritycommand] = useState([]);
//   const [severitysensitive,Setseveritysensitive] = useState([]);
//   const [severityserver,Setseverityserver] = useState([]);
//   const [projectOneDataXSS, setProjectOneDataXSS] = useState(0);
//   const [projectOneDataTravel, setProjectOneDataTravel] = useState(0);
//   const [httponly,sethttponly] = useState(0)
//   const [Sensitive,setsensitive] = useState(0)
//   const [command,setcommand] = useState(0)
//   const [expire,setexpire] = useState(0)
//   const [web,setwebb] = useState(0)
//   const [samsite,setsamsite] = useState(0)
//   const [secure,setsecure] = useState(0)
//   const [server,setserver] = useState(0)
//   const [HSTS,setHSTS] = useState(0)
//   const [valueENDpp, setvalueENDpp] = useState([]);
//   const [valueTimep,setvalueTimep]= useState([])
//   const [owaspData, setOwaspData] = useState([]);
//   const [updatedSeverities, setUpdatedSeverities] = useState({});
//   const [Delete,setDelete] = useState("")
//   const location = useLocation();
//   const user = localStorage.user;
//   const tokenuser= localStorage.getItem('token');
//   const token = new URLSearchParams(location.search).get('token');
//   useEffect(() => {
//     const fetchData = async () => {
//       try {

//         const response = await axios.get(`http://192.168.15.227:5000/edit-Dashboard?token=${token}`, {
//           headers: {
//             Authorization: `Bearer ${tokenuser}`,
//           },
//         });
  
//         if (response.data === "server error") {
//           Swal.fire({
//             icon: 'error',
//             title: 'User Error',
//           });
//         }
//       console.log(response)
      
//       setDelete(response.data[4].Role)
//       setOwaspData(response.data[13].owasp_);
//       setvalueENDpp(response.data[11].valueENDpp)   
//       setvalueTimep(response.data[12].valueTimep[0])   
      
//       setsamsite(response.data[8].select_att_ID_select_att_samsite_DATA[0].filter(item=> item !== null));
//       Setseveritysamsite(response.data[8].select_att_ID_select_att_samsite_DATA[1][0][0]);


      
//       if(response.data[8].select_att_ID_select_att_samsite_DATA[1][0]){

//         setsamsite(response.data[8].select_att_ID_select_att_samsite_DATA[0].filter(item=> item !== null));
//         Setseveritysamsite(response.data[8].select_att_ID_select_att_samsite_DATA[1][0][0]);
  
        
  
//       }
//       if(response.data[5].select_att_ID_select_att_secure_DATA[1][0]){

//         setsecure(response.data[5].select_att_ID_select_att_secure_DATA[0].filter(item=> item !== null));
//         SetseveritySecure(response.data[5].select_att_ID_select_att_secure_DATA[1][0][0]);
  
        
  
//       }
      
      
//       if(response.data[9].select_att_ID_select_att_server_DATA[1][0]){

//         setserver(response.data[9].select_att_ID_select_att_server_DATA[0].filter(item=> item !== null));
//         Setseverityserver(response.data[9].select_att_ID_select_att_server_DATA[1][0][0]);
  
//       }
      
//       if(response.data[14].select_att_ID_Sentitive[1][0]){

//         setsensitive(response.data[14].select_att_ID_Sentitive[0].filter(item=> item !== null));
//         Setseveritysensitive(response.data[14].select_att_ID_Sentitive[1][0][0]);
//       }

//       if(response.data[10].select_att_ID_select_att_HSTS_DATA[1][0]){
//         setHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA[0].filter(item=> item !== null));
//         SetseverityHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA[1][0][0]);
//       }




//       if(response.data[1].select_att_sql_DATA[1][0]){
//         setProjectOneDataSQL(response.data[1].select_att_sql_DATA[0].filter(item=> item !== null));
//         SetseveritySQL(response.data[1].select_att_sql_DATA[1][0][0]);
//       }


//       if(response.data[2].select_att_ID_xsssql_DATA[1][0]){
//         setProjectOneDataXSS(response.data[2].select_att_ID_xsssql_DATA[0].filter(item=> item !== null));
//         SetseverityXSS(response.data[2].select_att_ID_xsssql_DATA[1][0][0])
//       }


//       if(response.data[3].select_att_ID_select_att_traversal_DATA[1][0]){       
//         setProjectOneDataTravel(response.data[3].select_att_ID_select_att_traversal_DATA[0].filter(item=> item !== null));
//         SetseverityTraval(response.data[3].select_att_ID_select_att_traversal_DATA[1][0][0]);
//       }


//       if(response.data[6].select_att_ID_select_att_httponly_DATA[1][0]){
//         sethttponly(response.data[6].select_att_ID_select_att_httponly_DATA[0].filter(item=> item !== null));
//         Setseverityhttponly(response.data[6].select_att_ID_select_att_httponly_DATA[1][0][0]);
//       }



//       if(response.data[7].select_att_ID_select_att_expire_DATA[1][0]){
//         setexpire(response.data[7].select_att_ID_select_att_expire_DATA[0].filter(item=> item !== null));
//         Setseverityexpire(response.data[7].select_att_ID_select_att_expire_DATA[1][0][0]);
//       }

//       if(response.data[15].select_att_ID_webb[1][0]){
//         setwebb(response.data[15].select_att_ID_webb[0].filter(item=> item !== null));
//         Setseveritywebb(response.data[15].select_att_ID_webb[1][0][0]);
//       }
//       if(response.data[16].select_att_ID_commandd[1][0]){
//         setcommand(response.data[16].select_att_ID_commandd[0].filter(item=> item !== null));
//         Setseveritycommand(response.data[16].select_att_ID_commandd[1][0][0]);
//       }
//     //   setsensitive(response.data[14].select_att_ID_Sentitive[0].filter(item=> item !== null));
//     //   Setseveritysensitive(response.data[14].select_att_ID_Sentitive[1][0][0]);
//     //   setHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA[0].filter(item=> item !== null));
//     //     // console.log(response)
//     //   console.log(response.data[10].select_att_ID_select_att_HSTS_DATA[0])
//     //   console.log("dsd",response.data[10].select_att_ID_select_att_HSTS_DATA[1][0][0])
//     //   SetseverityHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA[1][0][0]);

      

//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// fetchData();
// }, [user,project_name_id, setDelete, setOwaspData,]);


//   const PieCout = () => {

//     const counts = {
//         high:
//           (severitySQL === "High" ? projectOneDataSQL.length : 0) +
//           (severityXSS === "High" ? projectOneDataXSS.length : 0) +
//           (severityTraval === "High" ? projectOneDataTravel.length : 0) +
//           (severitysamsite === "High" ? samsite.length : 0) +
//           (severitySecure === "High" ? secure.length : 0) +
//           (severityserver === "High" ? server.length : 0) +
//           (severityhttponly === "High" ? httponly.length : 0) +
//           (severityHSTS === "High" ? HSTS.length : 0) +
//           (severityexpire === "High" ? expire.length : 0)+
//           (severitysensitive === "High" ? Sensitive.length : 0)+
//           (severitywebb === "High" ? web.length : 0)+
//           (severitycommand === "High" ? command.length : 0),
//         medium:
//         (severitySQL === "Medium" ? projectOneDataSQL.length : 0) +
//         (severityXSS === "Medium" ? projectOneDataXSS.length : 0) +
//         (severityTraval === "Medium" ? projectOneDataTravel.length : 0) +
//         (severitysamsite === "Medium" ? samsite.length : 0) +
//         (severitySecure === "Medium" ? secure.length : 0) +
//         (severityserver === "Medium" ? server.length : 0) +
//         (severityhttponly === "Medium" ? httponly.length : 0) +
//         (severityHSTS === "Medium" ? HSTS.length : 0) +
//         (severityexpire === "Medium" ? expire.length : 0)+
//         (severitysensitive === "Medium" ? Sensitive.length : 0)+
//         (severitywebb === "Medium" ? web.length : 0)+
//         (severitycommand === "Medium" ? command.length : 0),
//         low:
//         (severitySQL === "Low" ? projectOneDataSQL.length : 0) +
//         (severityXSS === "Low" ? projectOneDataXSS.length : 0) +
//         (severityTraval === "Low" ? projectOneDataTravel.length : 0) +
//         (severitysamsite === "Low" ? samsite.length : 0) +
//         (severitySecure === "Low" ? secure.length : 0) +
//         (severityserver === "Low" ? server.length : 0) +
//         (severityhttponly === "Low" ? httponly.length : 0) +
//         (severityHSTS === "Low" ? HSTS.length : 0) +
//         (severityexpire === "Low" ? expire.length : 0)+
//         (severitysensitive === "Low" ? Sensitive.length : 0)+
//         (severitywebb === "Low" ? web.length : 0)+
//         (severitycommand === "Low" ? command.length : 0),
//       };
      
//     return counts;
//   };

//   const getColorForSeverity = (severity) => {
//     switch (severity) {
//       case 'Low':
//         return '#6F77B1';
//       case 'Medium':
//         return '#FFBB28';
//       case 'High':
//         return '#FF0000';
//       default:
//         return '#000000';
//     }
//   };

//   const vulnerCounts = PieCout();
// //     console.log("severitySQL",projectOneDataSQL)
// //   console.log("severityXSS",projectOneDataXSS)
// //   console.log("severityexpire",expire)
// //     console.log("severityTraval",projectOneDataTravel)
// //   console.log("severitySecure",secure)
// //   console.log("severityhttponly",httponly)
// //   console.log("severitysamsite",samsite)
// //   console.log("severitHSTS",HSTS)
// //   console.log("severityserver",server)


//   const pieChartData = [
//     { type: 'High', value: vulnerCounts.high },
//     { type: 'Medium', value: vulnerCounts.medium },
//     { type: 'Low', value: vulnerCounts.low },
//   ];
//   const RADIAN = Math.PI / 180;
//   const COLORS = ['#FF0000', '#FFBB28', '#6F77B1'];
//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);
//     return (
//       <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   const handleSeverityChange = (e, index, vulnerability) => {
//     const newUpdatedSeverities = { ...updatedSeverities };
//     newUpdatedSeverities[index] = e.target.value;
//     setUpdatedSeverities(newUpdatedSeverities);
//   };

//   const handleConfirmButtonClick = (vulnerability,selectedSeverity) => {


//     if (selectedSeverity) {
//       Swal.fire({
//         title: 'Are you Sure?',
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonText: 'Confirm',
//         cancelButtonText: 'Cancel',
//       }).then((result) => {""
//         if (result.isConfirmed) {
//           sendSeverityToAPI(vulnerability, selectedSeverity);
//         } else {
//           setUpdatedSeverities({ ...updatedSeverities});
//         }
//       });
//     } else {
//       Swal.fire({
//         icon: 'info',
//         title: 'Choices',
//       });
//     }
//   };

  // const sendSeverityToAPI = (vulnerability, newSeverity) => {
  //   axios.put(
  //     `http://192.168.15.227:5000/updateeditSeverity`,
  //     {
  //       vulnerability,
  //       newSeverity,
  //       token
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${tokenuser}`,
  //       },
  //     }
  //   )
//     .then(response => {

//     })
//     .catch(error => {

//     });
//   };
//   const handleDelete = (iddelete) => {  
//     /// ส่ง token user แบบheaders
  
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!"
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios.delete(`http://192.168.15.227:5000/edit_oneSeverity?project_name_id=${token}&record=${iddelete}`,{
//           headers:{
//             Authorization:`Bearer ${tokenuser}`,
//           },
//         }).then(response => {

  
//           Swal.fire({
//             title: "Deleted!",
//             text: "Your file has been deleted.",
//             icon: "success"
//           });
//         }).catch(error => {
//           console.log(error)
//         });
//       }
//     });
//   };
  

//   return (
//     <div className='dashboardd'>
//       <div className='dashboarddd'>
//         <div className='dashboard'>
//           <ResponsiveContainer width="100%" height={400}>
//             <h1>Current Issue</h1>
//             <PieChart>
//               <Pie
//                 data={pieChartData}
//                 cx="47%"
//                 cy="35%"
//                 labelLine={false}
//                 label={renderCustomizedLabel}
//                 outerRadius={120}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {pieChartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//           <div className='highlight-container'>
//             <div className='circle-red'></div>
//             <p>high({        
//           (severitySQL === "High" ? projectOneDataSQL.length : 0) +
//           (severityXSS === "High" ? projectOneDataXSS.length : 0) +
//           (severityTraval === "High" ? projectOneDataTravel.length : 0) +
//           (severitysamsite === "High" ? samsite.length : 0) +
//           (severitySecure === "High" ? secure.length : 0) +
//           (severityserver === "High" ? server.length : 0) +
//           (severityhttponly === "High" ? httponly.length : 0) +
//           (severityHSTS === "High" ? HSTS.length : 0) +
//           (severityexpire === "High" ? expire.length : 0)+
//           (severitysensitive === "High" ? Sensitive.length : 0)+
//           (severitywebb === "High" ? web.length : 0)+
//           (severitycommand === "High" ? command.length : 0)
          
//        })
//        </p>
//             <div className='circle-yellow'></div>
//             <p>medium ({   
//                     (severitySQL === "Medium" ? projectOneDataSQL.length : 0) +
//                     (severityXSS === "Medium" ? projectOneDataXSS.length : 0) +
//                     (severityTraval === "Medium" ? projectOneDataTravel.length : 0) +
//                     (severitysamsite === "Medium" ? samsite.length : 0) +
//                     (severitySecure === "Medium" ? secure.length : 0) +
//                     (severityserver === "Medium" ? server.length : 0) +
//                     (severityhttponly === "Medium" ? httponly.length : 0) +
//                     (severityHSTS === "Medium" ? HSTS.length : 0) +
//                     (severityexpire === "Medium" ? expire.length : 0)+
//                     (severitysensitive === "Medium" ? Sensitive.length : 0)+
//                     (severitywebb === "Medium" ? web.length : 0)+
//                     (severitycommand === "Medium" ? command.length : 0)
//                     })</p>
//             <div className='circle-blue'></div>
//             <p>low({      
//         (severitySQL === "Low" ? projectOneDataSQL.length : 0) +
//         (severityXSS === "Low" ? projectOneDataXSS.length : 0) +
//         (severityTraval === "Low" ? projectOneDataTravel.length : 0) +
//         (severitysamsite === "Low" ? samsite.length : 0) +
//         (severitySecure === "Low" ? secure.length : 0) +
//         (severityserver === "Low" ? server.length : 0) +
//         (severityhttponly === "Low" ? httponly.length : 0) +
//         (severityHSTS === "Low" ? HSTS.length : 0) +
//         (severityexpire === "Low" ? expire.length : 0)+
//         (severitysensitive === "Low" ? Sensitive.length : 0)+
//         (severitywebb === "Low" ? web.length : 0)+
//         (severitycommand === "Low" ? command.length : 0)
//         })</p>
//           </div>
//         </div>

//         <div className='dashboard2'>
//           <h1 style={{ textAlign: "center" }}>Current Process</h1>
//           {valueENDpp === null ? (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//               <ClockLoader 
//                 color={"#36d7b7"}
//                 loading={true}
//                 size={280}
//                 aria-label="Loading Spinner"
//                 data-testid="loader"
//               />
//               <p style={{ textAlign: "center", font: "16px" }}> Crawling...</p>
//             </div>
//           ) : (
//             <p style={{ textAlign: "center" }}> complete <br/> Start: {valueTimep}  <br/> End:{valueENDpp} </p>
//           )}
//         </div>

//       </div>
//       <h1>Summary</h1>
//       <div className='Sum'>
//         <div className="collapse-content" style={{ overflow: 'auto' }}>
//           <table>
//             <thead>
//               <tr>
//                 <th>Vulnerability</th>
//                 <th>Severity</th>
//               </tr>
//             </thead>
//             <tbody>
//             {owaspData.map((item, index) => (
//   <tr key={index}>
//     <td style={{ color: getColorForSeverity(item[1]) }}>{item[0]}</td>
//     <td>
//       <select
//         style={{ color: getColorForSeverity(item[1]) }}
//         value={updatedSeverities[index] || item[1]}
//         onChange={(e) => handleSeverityChange(e, index, item[0])}
//       >
//         <option style={{ color: "#6F77B1" }} value="Low">
//           Low
//         </option>
//         <option style={{ color: "#FFBB28" }} value="Medium">
//           Medium
//         </option>
//         <option style={{ color: "#FF0000" }} value="High">
//           High
//         </option>
//       </select>
//       <Button  style={{marginLeft:"20px"}} onClick={() => handleConfirmButtonClick(item[0], updatedSeverities[index] || item[1])}>Confirm</Button>
//       {Delete === 'Advance'&& ( 
//             <Space size="middle">
              
//               <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(item[2])}> </Button>
//           </Space>)}
//     </td>
//   </tr>
// ))}

//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditDashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import "./Dashboard.css";
import Swal from "sweetalert2";
import ClockLoader from "react-spinners/ClockLoader";
import {CheckCircleOutlined} from '@ant-design/icons';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  theme,
  Collapse,
  ConfigProvider,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  CloseOutlined,
  FormOutlined,
  RightOutlined,
} from "@ant-design/icons";

const EditDashboard = () => {
  const { project_name_id } = useParams();
  const [projectOneDataSQL, setProjectOneDataSQL] = useState(0);
  const [severitySQL, SetseveritySQL] = useState([]);
  const [severityXSS, SetseverityXSS] = useState([]);
  const [severityTraval, SetseverityTraval] = useState([]);
  const [severitySecure, SetseveritySecure] = useState([]);
  const [severityhttponly, Setseverityhttponly] = useState([]);
  const [severitywebb, Setseveritywebb] = useState([]);
  const [severityexpire, Setseverityexpire] = useState([]);
  const [severitysamsite, Setseveritysamsite] = useState([]);
  const [severityHSTS, SetseverityHSTS] = useState([]);
  const [severitycommand, Setseveritycommand] = useState([]);
  const [severitysensitive, Setseveritysensitive] = useState([]);
  const [severityserver, Setseverityserver] = useState([]);
  const [projectOneDataXSS, setProjectOneDataXSS] = useState(0);
  const [projectOneDataTravel, setProjectOneDataTravel] = useState(0);
  const [httponly, sethttponly] = useState(0);
  const [Sensitive, setsensitive] = useState(0);
  const [command, setcommand] = useState(0);
  const [expire, setexpire] = useState(0);
  const [web, setwebb] = useState(0);
  const [samsite, setsamsite] = useState(0);
  const [secure, setsecure] = useState(0);
  const [server, setserver] = useState(0);
  const [HSTS, setHSTS] = useState(0);
  const [valueENDpp, setvalueENDpp] = useState([]);
  const [valueTimep, setvalueTimep] = useState([]);
  const [owaspData, setOwaspData] = useState([]);
  const [updatedSeverities, setUpdatedSeverities] = useState({});
  const [Delete, setDelete] = useState("");
  const location = useLocation();
  const tokenuser= localStorage.getItem('token');
  const token = new URLSearchParams(location.search).get('token');
  const user = localStorage.user;
  const fetchData = async () => {
    try {

        const response = await axios.get(`http://192.168.15.227:5000/edit-Dashboard?token=${token}`, {
          headers: {
            Authorization: `Bearer ${tokenuser}`,
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'
          },
        });

      if (response.data === "server error") {
        Swal.fire({
          icon: "error",
          title: "User Error",
        });
      }
      console.log(response);

      setDelete(response.data[4].Role);
      setOwaspData(response.data[13].owasp_);
      setvalueENDpp(response.data[11].valueENDpp);
      setvalueTimep(response.data[12].valueTimep[0]);

      setsamsite(
        response.data[8].select_att_ID_select_att_samsite_DATA[0].filter(
          (item) => item !== null
        )
      );
      Setseveritysamsite(
        response.data[8].select_att_ID_select_att_samsite_DATA[1][0][0]
      );

      if (response.data[8].select_att_ID_select_att_samsite_DATA[1][0]) {
        setsamsite(
          response.data[8].select_att_ID_select_att_samsite_DATA[0].filter(
            (item) => item !== null
          )
        );
        Setseveritysamsite(
          response.data[8].select_att_ID_select_att_samsite_DATA[1][0][0]
        );
      }
      if (response.data[5].select_att_ID_select_att_secure_DATA[1][0]) {
        setsecure(
          response.data[5].select_att_ID_select_att_secure_DATA[0].filter(
            (item) => item !== null
          )
        );
        SetseveritySecure(
          response.data[5].select_att_ID_select_att_secure_DATA[1][0][0]
        );
      }

      if (response.data[9].select_att_ID_select_att_server_DATA[1][0]) {
        setserver(
          response.data[9].select_att_ID_select_att_server_DATA[0].filter(
            (item) => item !== null
          )
        );
        Setseverityserver(
          response.data[9].select_att_ID_select_att_server_DATA[1][0][0]
        );
      }

      if (response.data[14].select_att_ID_Sentitive[1][0]) {
        setsensitive(
          response.data[14].select_att_ID_Sentitive[0].filter(
            (item) => item !== null
          )
        );
        Setseveritysensitive(
          response.data[14].select_att_ID_Sentitive[1][0][0]
        );
      }

      if (response.data[10].select_att_ID_select_att_HSTS_DATA[1][0]) {
        setHSTS(
          response.data[10].select_att_ID_select_att_HSTS_DATA[0].filter(
            (item) => item !== null
          )
        );
        SetseverityHSTS(
          response.data[10].select_att_ID_select_att_HSTS_DATA[1][0][0]
        );
      }

      if (response.data[1].select_att_sql_DATA[1][0]) {
        setProjectOneDataSQL(
          response.data[1].select_att_sql_DATA[0].filter(
            (item) => item !== null
          )
        );
        SetseveritySQL(response.data[1].select_att_sql_DATA[1][0][0]);
      }

      if (response.data[2].select_att_ID_xsssql_DATA[1][0]) {
        setProjectOneDataXSS(
          response.data[2].select_att_ID_xsssql_DATA[0].filter(
            (item) => item !== null
          )
        );
        SetseverityXSS(response.data[2].select_att_ID_xsssql_DATA[1][0][0]);
      }

      if (response.data[3].select_att_ID_select_att_traversal_DATA[1][0]) {
        setProjectOneDataTravel(
          response.data[3].select_att_ID_select_att_traversal_DATA[0].filter(
            (item) => item !== null
          )
        );
        SetseverityTraval(
          response.data[3].select_att_ID_select_att_traversal_DATA[1][0][0]
        );
      }

      if (response.data[6].select_att_ID_select_att_httponly_DATA[1][0]) {
        sethttponly(
          response.data[6].select_att_ID_select_att_httponly_DATA[0].filter(
            (item) => item !== null
          )
        );
        Setseverityhttponly(
          response.data[6].select_att_ID_select_att_httponly_DATA[1][0][0]
        );
      }

      if (response.data[7].select_att_ID_select_att_expire_DATA[1][0]) {
        setexpire(
          response.data[7].select_att_ID_select_att_expire_DATA[0].filter(
            (item) => item !== null
          )
        );
        Setseverityexpire(
          response.data[7].select_att_ID_select_att_expire_DATA[1][0][0]
        );
      }

      if (response.data[15].select_att_ID_webb[1][0]) {
        setwebb(
          response.data[15].select_att_ID_webb[0].filter(
            (item) => item !== null
          )
        );
        Setseveritywebb(response.data[15].select_att_ID_webb[1][0][0]);
      }
      if (response.data[16].select_att_ID_commandd[1][0]) {
        setcommand(
          response.data[16].select_att_ID_commandd[0].filter(
            (item) => item !== null
          )
        );
        Setseveritycommand(response.data[16].select_att_ID_commandd[1][0][0]);
      }
      //   setsensitive(response.data[14].select_att_ID_Sentitive[0].filter(item=> item !== null));
      //   Setseveritysensitive(response.data[14].select_att_ID_Sentitive[1][0][0]);
      //   setHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA[0].filter(item=> item !== null));
      //     // console.log(response)
      //   console.log(response.data[10].select_att_ID_select_att_HSTS_DATA[0])
      //   console.log("dsd",response.data[10].select_att_ID_select_att_HSTS_DATA[1][0][0])
      //   SetseverityHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA[1][0][0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [project_name_id]);

  const PieCout = () => {
    const counts = {
      Critical:
      (severitySQL === "Critical" ? projectOneDataSQL.length : 0) +
      (severityXSS === "Critical" ? projectOneDataXSS.length : 0) +
      (severityTraval === "Critical" ? projectOneDataTravel.length : 0) +
      (severitysamsite === "Critical" ? samsite.length : 0) +
      (severitySecure === "Critical" ? secure.length : 0) +
      (severityserver === "Critical" ? server.length : 0) +
      (severityhttponly === "Critical" ? httponly.length : 0) +
      (severityHSTS === "Critical" ? HSTS.length : 0) +
      (severityexpire === "Critical" ? expire.length : 0) +
      (severitysensitive === "Critical" ? Sensitive.length : 0) +
      (severitywebb === "Critical" ? web.length : 0) +
      (severitycommand === "Critical" ? command.length : 0),
      high:
        (severitySQL === "High" ? projectOneDataSQL.length : 0) +
        (severityXSS === "High" ? projectOneDataXSS.length : 0) +
        (severityTraval === "High" ? projectOneDataTravel.length : 0) +
        (severitysamsite === "High" ? samsite.length : 0) +
        (severitySecure === "High" ? secure.length : 0) +
        (severityserver === "High" ? server.length : 0) +
        (severityhttponly === "High" ? httponly.length : 0) +
        (severityHSTS === "High" ? HSTS.length : 0) +
        (severityexpire === "High" ? expire.length : 0) +
        (severitysensitive === "High" ? Sensitive.length : 0) +
        (severitywebb === "High" ? web.length : 0) +
        (severitycommand === "High" ? command.length : 0),
      medium:
        (severitySQL === "Medium" ? projectOneDataSQL.length : 0) +
        (severityXSS === "Medium" ? projectOneDataXSS.length : 0) +
        (severityTraval === "Medium" ? projectOneDataTravel.length : 0) +
        (severitysamsite === "Medium" ? samsite.length : 0) +
        (severitySecure === "Medium" ? secure.length : 0) +
        (severityserver === "Medium" ? server.length : 0) +
        (severityhttponly === "Medium" ? httponly.length : 0) +
        (severityHSTS === "Medium" ? HSTS.length : 0) +
        (severityexpire === "Medium" ? expire.length : 0) +
        (severitysensitive === "Medium" ? Sensitive.length : 0) +
        (severitywebb === "Medium" ? web.length : 0) +
        (severitycommand === "Medium" ? command.length : 0),
      low:
        (severitySQL === "Low" ? projectOneDataSQL.length : 0) +
        (severityXSS === "Low" ? projectOneDataXSS.length : 0) +
        (severityTraval === "Low" ? projectOneDataTravel.length : 0) +
        (severitysamsite === "Low" ? samsite.length : 0) +
        (severitySecure === "Low" ? secure.length : 0) +
        (severityserver === "Low" ? server.length : 0) +
        (severityhttponly === "Low" ? httponly.length : 0) +
        (severityHSTS === "Low" ? HSTS.length : 0) +
        (severityexpire === "Low" ? expire.length : 0) +
        (severitysensitive === "Low" ? Sensitive.length : 0) +
        (severitywebb === "Low" ? web.length : 0) +
        (severitycommand === "Low" ? command.length : 0),
    };

    return counts;
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
        return '#000000';
    }
  };

  const vulnerCounts = PieCout();
  //     console.log("severitySQL",projectOneDataSQL)
  //   console.log("severityXSS",projectOneDataXSS)
  //   console.log("severityexpire",expire)
  //     console.log("severityTraval",projectOneDataTravel)
  //   console.log("severitySecure",secure)
  //   console.log("severityhttponly",httponly)
  //   console.log("severitysamsite",samsite)
  //   console.log("severitHSTS",HSTS)
  //   console.log("severityserver",server)

  const pieChartData = [
    { type: "Critical", value: vulnerCounts.Critical },
    { type: "High", value: vulnerCounts.high },
    { type: "Medium", value: vulnerCounts.medium },
    { type: "Low", value: vulnerCounts.low },
  ];
  const RADIAN = Math.PI / 180;
  const COLORS = ["#FF0000","#FF5100", "#FFBB28", "#6F77B1"];
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleSeverityChange = (e, index, vulnerability) => {
    const newUpdatedSeverities = { ...updatedSeverities };
    newUpdatedSeverities[index] = e.target.value;
    setUpdatedSeverities(newUpdatedSeverities);
  };

  const handleConfirmButtonClick = async (vulnerability, selectedSeverity) => {
    if (selectedSeverity) {
      try {
        const result = await Swal.fire({
          title: "Are you Sure?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
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
        icon: "info",
        title: "Choices",
      });
    }
  };

  const sendSeverityToAPI = async (vulnerability, newSeverity) => {
    try {
      await  
        axios.put(
            `http://192.168.15.227:5000/updateeditSeverity`,
            {
              vulnerability,
              newSeverity,
              token
            },
            {
              headers: {
                Authorization: `Bearer ${tokenuser}`,
                'Access-Control-Allow-Origin' : '*',
                'Content-Type': 'application/json'
              },
            }
          )
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (iddelete) => {
    const token = localStorage.getItem("token");
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await
        axios.delete(`http://192.168.15.227:5000/edit_oneSeverity?project_name_id=${token}&record=${iddelete}`,{
                    headers:{
                      Authorization:`Bearer ${tokenuser}`,
                      'Access-Control-Allow-Origin' : '*',
                      'Content-Type': 'application/json'
                    },
                  })

        await fetchData();

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="dashboardd">
      <div className="dashboard-s1">
        <div className="dashboard-s1-b1">
          <h1>Current Issues</h1>
          <ResponsiveContainer width="100%" height={350} alignItems="center">
            
            <PieChart>
              <Pie
                data={pieChartData}
                cx="47%"
                cy="35%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="highlight-container">
          <div className="circle-red"></div>
            <p>
            Critical(
              {(severitySQL === "Critical" ? projectOneDataSQL.length : 0) +
                (severityXSS === "Critical" ? projectOneDataXSS.length : 0) +
                (severityTraval === "Critical" ? projectOneDataTravel.length : 0) +
                (severitysamsite === "Critical" ? samsite.length : 0) +
                (severitySecure === "Critical" ? secure.length : 0) +
                (severityserver === "Critical" ? server.length : 0) +
                (severityhttponly === "Critical" ? httponly.length : 0) +
                (severityHSTS === "Critical" ? HSTS.length : 0) +
                (severityexpire === "Critical" ? expire.length : 0) +
                (severitysensitive === "Critical" ? Sensitive.length : 0) +
                (severitywebb === "Critical" ? web.length : 0) +
                (severitycommand === "Critical" ? command.length : 0)}
              )
            </p>
            <div className="circle-orange"></div>
            <p>
              high(
              {(severitySQL === "High" ? projectOneDataSQL.length : 0) +
                (severityXSS === "High" ? projectOneDataXSS.length : 0) +
                (severityTraval === "High" ? projectOneDataTravel.length : 0) +
                (severitysamsite === "High" ? samsite.length : 0) +
                (severitySecure === "High" ? secure.length : 0) +
                (severityserver === "High" ? server.length : 0) +
                (severityhttponly === "High" ? httponly.length : 0) +
                (severityHSTS === "High" ? HSTS.length : 0) +
                (severityexpire === "High" ? expire.length : 0) +
                (severitysensitive === "High" ? Sensitive.length : 0) +
                (severitywebb === "High" ? web.length : 0) +
                (severitycommand === "High" ? command.length : 0)}
              )
            </p>
            <div className="circle-yellow"></div>
            <p>
              medium (
              {(severitySQL === "Medium" ? projectOneDataSQL.length : 0) +
                (severityXSS === "Medium" ? projectOneDataXSS.length : 0) +
                (severityTraval === "Medium"
                  ? projectOneDataTravel.length
                  : 0) +
                (severitysamsite === "Medium" ? samsite.length : 0) +
                (severitySecure === "Medium" ? secure.length : 0) +
                (severityserver === "Medium" ? server.length : 0) +
                (severityhttponly === "Medium" ? httponly.length : 0) +
                (severityHSTS === "Medium" ? HSTS.length : 0) +
                (severityexpire === "Medium" ? expire.length : 0) +
                (severitysensitive === "Medium" ? Sensitive.length : 0) +
                (severitywebb === "Medium" ? web.length : 0) +
                (severitycommand === "Medium" ? command.length : 0)}
              )
            </p>
            <div className="circle-blue"></div>
            <p>
              low(
              {(severitySQL === "Low" ? projectOneDataSQL.length : 0) +
                (severityXSS === "Low" ? projectOneDataXSS.length : 0) +
                (severityTraval === "Low" ? projectOneDataTravel.length : 0) +
                (severitysamsite === "Low" ? samsite.length : 0) +
                (severitySecure === "Low" ? secure.length : 0) +
                (severityserver === "Low" ? server.length : 0) +
                (severityhttponly === "Low" ? httponly.length : 0) +
                (severityHSTS === "Low" ? HSTS.length : 0) +
                (severityexpire === "Low" ? expire.length : 0) +
                (severitysensitive === "Low" ? Sensitive.length : 0) +
                (severitywebb === "Low" ? web.length : 0) +
                (severitycommand === "Low" ? command.length : 0)}
              )
            </p>
          </div>
        </div>

        <div className="dashboard-s1-b2">
          <h1>Current Process</h1>
          {valueENDpp === null ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClockLoader
                color={"#36d7b7"}
                loading={true}
                size={280}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <p style={{ textAlign: "center", font: "16px" }}> Scanning...</p>
            </div>
          ) : (
            <div style={{
              marginTop: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <CheckCircleOutlined  style={{ fontSize: '80px', color: '#08c'}} />
              <p style={{ textAlign: "center" }}>
                {" "}
                complete <br /> Start: {valueTimep} <br /> End:{valueENDpp}{" "}
              </p>
            </div>
            
          )}
        </div>
      </div>
      <div className="dashboard-s2">
      <h1>Summary</h1>
      <div className="Sum">
        <div className="collapse-content" style={{ overflow: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Vulnerability</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {owaspData.map((item, index) => (
                <tr key={index}>
                  <td style={{ color: getColorForSeverity(item[1]) }}>
                    {item[0]}
                  </td>
                  <td>
                    <select
                      style={{ color: getColorForSeverity(item[1]) }}
                      value={updatedSeverities[index] || item[1]}
                      onChange={(e) => handleSeverityChange(e, index, item[0])}
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
                    <Button
                      style={{ marginLeft: "20px" }}
                      onClick={() =>
                        handleConfirmButtonClick(
                          item[0],
                          updatedSeverities[index] || item[1]
                        )
                      }
                    >
                      Confirm
                    </Button>
                    {Delete === "Advance" && (
                      <Space size="middle">
                        <Button
                          type="danger"
                          icon={
                            <CloseOutlined
                              className="close-button"
                              style={{ color: "red,", marginBottom: "20px" }}
                            />
                          }
                          onClick={() => handleDelete(item[2])}
                        >
                          {" "}
                        </Button>
                      </Space>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>

    </div>
  );
};

export default EditDashboard;
