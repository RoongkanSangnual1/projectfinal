// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
// import './Dashboard.css'
// import Swal from 'sweetalert2'
// import ClockLoader   from "react-spinners/ClockLoader";
// const Dashboard = () => {
//   const { project_name_id } = useParams();
//   const [projectOneDataSQL, setProjectOneDataSQL] = useState(0);
//   const [projectOneDataXSS, setProjectOneDataXSS] = useState(0);
//   const [projectOneDataTravel, setProjectOneDataTravel] = useState(0);
//   const [httponly,sethttponly] = useState(0)
//   const [expire,setexpire] = useState(0)
//   const [samsite,setsamsite] = useState(0)
//   const [secure,setsecure] = useState(0)
//   const [server,setserver] = useState(0)
//   const [HSTS,setHSTS] = useState(0)
//   const [valueENDpp, setvalueENDpp] = useState([]);
//   const [valueTimep,setvalueTimep]= useState([])
//   const user = localStorage.user;

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     axios.get(`http://127.0.0.1:5000/dashboard?project_name_id=${project_name_id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => { 
//       if(response.data === "server error"){
//         Swal.fire({
//           icon: 'error',
//           title: 'User Eror',
//           // text: 'User Eror',
//         });


//       }
//       // console.log(response.data[11])
//       // console.log(response)
//       setvalueENDpp(response.data[11].valueENDpp)   
//       setvalueTimep(response.data[12].valueTimep[0])   
//       setProjectOneDataSQL(response.data[1].select_att_sql_DATA.filter(item=> item !== null));
//       setProjectOneDataXSS(response.data[2].select_att_ID_xsssql_DATA.filter(item=> item !== null));
//       setProjectOneDataTravel(response.data[3].select_att_ID_select_att_traversal_DATA.filter(item=> item !== null));
//       sethttponly(response.data[6].select_att_ID_select_att_httponly_DATA.filter(item=> item !== null));
//       setexpire(response.data[7].select_att_ID_select_att_expire_DATA.filter(item=> item !== null));
//       setsamsite(response.data[8].select_att_ID_select_att_samsite_DATA.filter(item=> item !== null));
//       setsecure(response.data[5].select_att_ID_select_att_secure_DATA.filter(item=> item !== null));
//       setserver(response.data[9].select_att_ID_select_att_server_DATA.filter(item=> item !== null));
//       setHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA.filter(item=> item !== null))
//       // console.log(server)
      
//     })
//     .catch(error => {
//       // console.error(error);
     
//       Swal.fire({
//         icon: 'error',
//         title: 'User Eror',
//         // text: 'User Eror',
//       });
//     })
//   }, [user, project_name_id]); 

//   const classifyVulnerabilities = () => {
//     const counts = {
//       high: projectOneDataSQL.length + projectOneDataXSS.length,
//       medium: projectOneDataTravel.length,
//       low:httponly.length+server.length+secure.length+samsite.length+expire.length+HSTS.length,
//     };
  
//     return counts;
//   };

//   const vulnerabilityCounts = classifyVulnerabilities();
//   const pieChartData = [
//     { type: 'High', value: vulnerabilityCounts.high },
//     { type: 'Medium', value: vulnerabilityCounts.medium },
//     { type: 'Low', value: vulnerabilityCounts.low },
//   ];
//   const RADIAN = Math.PI / 180;
//   const COLORS = ['#FF0000', '#FFBB28',  '#6F77B1 '];
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
   
//   return (
//     <div className='dashboardd'>
//          <div className='dashboarddd'>
//       <div className='dashboard'>
//         <ResponsiveContainer width="100%" height={400}>
//         <h1>Current Issue</h1>
//           <PieChart>
//             <Pie
//               data={pieChartData}
//               cx="47%"
//               cy="35%"
//               labelLine={false}
//               label={renderCustomizedLabel}
//               outerRadius={120}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {pieChartData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//          <div className='highlight-container'>
//         <div className='circle-red'></div>
//         <p>high({ projectOneDataSQL.length + projectOneDataXSS.length})</p>
//         <div className='circle-yellow'></div>
//         <p>medium ({projectOneDataTravel.length})</p>
//         <div className='circle-blue'></div>
//         <p>low({httponly.length+server.length+secure.length+samsite.length+expire.length+HSTS.length})</p>
//       </div>
//       </div>

//       <div className='dashboard2'>
//       <h1 style={{ textAlign: "center" }}>Current Process</h1>
//         {valueENDpp === null ? (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//             <ClockLoader 
//                 color={"#36d7b7"}
//                 loading={true}
//                 size={280}
//                 aria-label="Loading Spinner"
//                 data-testid="loader"
//             />
//             <p style={{ textAlign: "center" ,font:"16px"}}> Crawling...</p>
//         </div>
        
//         ) : (
//           <p style={{ textAlign: "center" }}> complete <br/> Start: {valueTimep}  <br/> End:{valueENDpp} </p>
//         )}

//       </div>

//       </div>
//       <h1>Summary</h1>
//       <div className='Sum'>
      
      

//         <div className="collapse-content" style={{ overflow: 'auto' }}>
//           <table>
//           <thead>
//               <tr>
//                 <th>Vulnerability</th>
//                 <th>Severity</th>
//               </tr>
//             </thead>
//             <tbody>
//               {projectOneDataSQL.length>0 &&( <tr>
//                 <td>SQL injection</td>
//                 <td style={{color:"#FF0000"}}> High</td>
//                 </tr>)}

//             {projectOneDataXSS.length>0 &&( <tr>
//               <td>  Stored Cross Site Scriptng     </td>
//               <td style={{color:"#FF0000"}}> High</td>
       
//             </tr>)}
//             {projectOneDataTravel.length>0 &&(<tr>
//               <td >
//               Directory Traversal File Include
//               </td>
//               <td style={{color:" #FFBB28"}}>
//                 Medium
//               </td>
//             </tr>)}
//             {secure.length>0 &&(<tr>
//               <td >
//               Missing Secure Attribute in Cookie Header
//               </td>
//               <td style={{color:" #6F77B1"}}>
//                 Low
//               </td>
//             </tr>)}
//             {httponly.length>0 &&(<tr>
//               <td >
//               Missing HttpOnly Attribute in Cookie Header
//               </td>
//               <td style={{color:" #6F77B1"}}>
//                 Low
//               </td>
//             </tr>)}
//             {expire.length>0 &&(<tr>
//               <td >
//               Missing Expires Attribute in Cookie Header
//               </td>
//               <td style={{color:" #6F77B1"}}>
//                 Low
//               </td>
//             </tr>)}
//             {samsite.length>0 &&(<tr>
//               <td >
//               Missing SameSite Attribute in Cookie Header
//               </td>
//               <td style={{color:" #6F77B1"}}>
//                 Low
//               </td>
//             </tr>)}
//             {server.length>0 &&(<tr>
//               <td >
//               Web Server Infomation Leakage through 'Server' header
//               </td>
//               <td style={{color:" #6F77B1"}}>
//                 Low
//               </td>
//             </tr>)}
//             {HSTS.length>0 &&(<tr>
//               <td >
//               Web Server Infomation Leakage through 'Server' header
//               </td>
//               <td style={{color:" #6F77B1"}}>
//                 Low
//               </td>
//             </tr>)}
//             </tbody>
//             </table>
//             </div>
          
     
//         </div>
//       </div>

//   );
  
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css';
import Swal from 'sweetalert2';
import ClockLoader from 'react-spinners/ClockLoader';


const Dashboard = () => {
  const { project_name_id } = useParams();
  const [projectOneDataSQL, setProjectOneDataSQL] = useState([]);
  const [projectOneDataXSS, setProjectOneDataXSS] = useState([]);
  const [projectOneDataTravel, setProjectOneDataTravel] = useState([]);
  const [httponly, sethttponly] = useState([]);
  const [expire, setexpire] = useState([]);
  const [samsite, setsamsite] = useState([]);
  const [secure, setsecure] = useState([]);
  const [server, setserver] = useState([]);
  const [HSTS, setHSTS] = useState([]);
  const [valueENDpp, setvalueENDpp] = useState([]);
  const [valueTimep, setvalueTimep] = useState([]);
  const [user, setUser] = useState(localStorage.user);
  const navigate = useNavigate()

  const [editedSeverities, setEditedSeverities] = useState({
    SQL: 'High',
    XSS: 'High',
    Travel: 'Medium',
    Secure: 'Low',
    HttpOnly: 'Low',
    Expire: 'Low',
    SameSite: 'Low',
    Server: 'Low',
    HSTS: 'Low',
  });
  const [severityCounts, setSeverityCounts] = useState({
    high: 0,
    medium: 0,
    low: 0,
  });
  const classifyVulnerabilities = () => {
    const counts = {
      high:
        projectOneDataSQL.filter((item) => editedSeverities.SQL === 'High').length +
        projectOneDataXSS.filter((item) => editedSeverities.XSS === 'High').length+
        projectOneDataTravel.filter((item) => editedSeverities.Travel === 'High').length+
        httponly.filter((item) => editedSeverities.HttpOnly === 'High').length+
        server.filter((item) => editedSeverities.Server === 'High').length+
        secure.filter((item) => editedSeverities.Secure === 'High').length+
        samsite.filter((item) => editedSeverities.SameSite === 'High').length+
        expire.filter((item) => editedSeverities.Expire === 'High').length+
        HSTS.filter((item) => editedSeverities.HSTS === 'High').length,
      medium: 
      projectOneDataSQL.filter((item) => editedSeverities.SQL === 'Medium').length +
      projectOneDataXSS.filter((item) => editedSeverities.XSS === 'Medium').length+
      projectOneDataTravel.filter((item) => editedSeverities.Travel === 'Medium').length+
      httponly.filter((item) => editedSeverities.HttpOnly === 'Medium').length+
      server.filter((item) => editedSeverities.Server === 'Medium').length+
      secure.filter((item) => editedSeverities.Secure === 'Medium').length+
      samsite.filter((item) => editedSeverities.SameSite === 'Medium').length+
      expire.filter((item) => editedSeverities.Expire === 'Medium').length+
      HSTS.filter((item) => editedSeverities.HSTS === 'Medium').length,
      low: 
      projectOneDataSQL.filter((item) => editedSeverities.SQL === 'Low').length +
      projectOneDataXSS.filter((item) => editedSeverities.XSS === 'Low').length+
      projectOneDataTravel.filter((item) => editedSeverities.Travel === 'Low').length+
      httponly.filter((item) => editedSeverities.HttpOnly === 'Low').length+
      server.filter((item) => editedSeverities.Server === 'Low').length+
      secure.filter((item) => editedSeverities.Secure === 'Low').length+
      samsite.filter((item) => editedSeverities.SameSite === 'Low').length+
      expire.filter((item) => editedSeverities.Expire === 'Low').length+
      HSTS.filter((item) => editedSeverities.HSTS === 'Low').length,
    };

    setSeverityCounts(counts);

    return counts;
  };

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://127.0.0.1:5000/dashboard?project_name_id=${project_name_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response)
        if (response.data === 'server error') {
          Swal.fire({
            icon: 'error',
            title: 'User Error',
          })
          navigate('/login')
        } else {
          setvalueENDpp(response.data[11].valueENDpp);
          setvalueTimep(response.data[12].valueTimep[0]);
          setProjectOneDataSQL(response.data[1].select_att_sql_DATA.filter((item) => item !== null));
          setProjectOneDataXSS(response.data[2].select_att_ID_xsssql_DATA.filter((item) => item !== null));
          setProjectOneDataTravel(response.data[3].select_att_ID_select_att_traversal_DATA.filter((item) => item !== null));
          sethttponly(response.data[6].select_att_ID_select_att_httponly_DATA.filter((item) => item !== null));
          setexpire(response.data[7].select_att_ID_select_att_expire_DATA.filter((item) => item !== null));
          setsamsite(response.data[8].select_att_ID_select_att_samsite_DATA.filter((item) => item !== null));
          setsecure(response.data[5].select_att_ID_select_att_secure_DATA.filter((item) => item !== null));
          setserver(response.data[9].select_att_ID_select_att_server_DATA.filter((item) => item !== null));
          setHSTS(response.data[10].select_att_ID_select_att_HSTS_DATA.filter((item) => item !== null));
          // กำหนดค่าเริ่มต้นที่นี่
          setEditedSeverities({
            SQL: 'High',
            XSS: 'High',
            Travel: 'Medium',
            Secure: 'Low',
            HttpOnly: 'Low',
            Expire: 'Low',
            SameSite: 'Low',
            Server: 'Low',
            HSTS: 'Low',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'User Error',
        });
      });
  }, [user, project_name_id]);

  
  useEffect(() => {
    const severity = localStorage.getItem(`severity${project_name_id}`);
    if (severity) {
      setSeverityCounts(JSON.parse(severity));
    } else {
      setSeverityCounts({
        high: 0,
        medium: 0,
        low: 0,
      });
    }
  }, [project_name_id]);
  
  useEffect(() => {
    const counts = classifyVulnerabilities();
    localStorage.setItem(`severity${project_name_id}`, JSON.stringify(counts));
  }, [editedSeverities, projectOneDataSQL, projectOneDataXSS, projectOneDataTravel, httponly, server, secure, samsite, expire, HSTS, project_name_id]);
  


  const getColorForSeverity = (severity) => {
    switch (severity) {
      case 'Low':
        return '#6F77B1';
      case 'Medium':
        return '#FFBB28';
      case 'High':
        return '#FF0000';
    }
  };

  const pieChartData = [
    { type: 'High', value: severityCounts.high },
    { type: 'Medium', value: severityCounts.medium },
    { type: 'Low', value: severityCounts.low },
  ];

  const RADIAN = Math.PI / 180;
  const COLORS = ['#FF0000', '#FFBB28', '#6F77B1'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className="dashboardd">
      <div className="dashboarddd">
        <div className="dashboard">
          <ResponsiveContainer width="100%" height={400}>
            <h1>Current Issue</h1>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="highlight-container">
            <div className="circle-red"></div>
            <p>high({
            projectOneDataSQL.filter((item) => editedSeverities.SQL === 'High').length +
            projectOneDataXSS.filter((item) => editedSeverities.XSS === 'High').length+
            projectOneDataTravel.filter((item) => editedSeverities.Travel === 'High').length+
            httponly.filter((item) => editedSeverities.HttpOnly === 'High').length+
            server.filter((item) => editedSeverities.Server === 'High').length+
            secure.filter((item) => editedSeverities.Secure === 'High').length+
            samsite.filter((item) => editedSeverities.SameSite === 'High').length+
            expire.filter((item) => editedSeverities.Expire === 'High').length+
            HSTS.filter((item) => editedSeverities.HSTS === 'High').length
        })</p>
            <div className="circle-yellow"></div>
            <p>medium ({ 
            projectOneDataSQL.filter((item) => editedSeverities.SQL === 'Medium').length +
            projectOneDataXSS.filter((item) => editedSeverities.XSS === 'Medium').length+
            projectOneDataTravel.filter((item) => editedSeverities.Travel === 'Medium').length+
            httponly.filter((item) => editedSeverities.HttpOnly === 'Medium').length+
            server.filter((item) => editedSeverities.Server === 'Medium').length+
            secure.filter((item) => editedSeverities.Secure === 'Medium').length+
            samsite.filter((item) => editedSeverities.SameSite === 'Medium').length+
            expire.filter((item) => editedSeverities.Expire === 'Medium').length+
            HSTS.filter((item) => editedSeverities.HSTS === 'Medium').length
      })</p>
            <div className="circle-blue"></div>
            <p>low({
            projectOneDataSQL.filter((item) => editedSeverities.SQL === 'Low').length +
            projectOneDataXSS.filter((item) => editedSeverities.XSS === 'Low').length+
            projectOneDataTravel.filter((item) => editedSeverities.Travel === 'Low').length+
            httponly.filter((item) => editedSeverities.HttpOnly === 'Low').length+
            server.filter((item) => editedSeverities.Server === 'Low').length+
            secure.filter((item) => editedSeverities.Secure === 'Low').length+
            samsite.filter((item) => editedSeverities.SameSite === 'Low').length+
            expire.filter((item) => editedSeverities.Expire === 'Low').length+
            HSTS.filter((item) => editedSeverities.HSTS === 'Low').length
            })</p>
          </div>
        </div>
  
        <div className="dashboard2">
          <h1 style={{ textAlign: "center" }}>Current Process</h1>
          {valueENDpp === null ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <ClockLoader
                color={"#36d7b7"}
                loading={true}
                size={280}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <p style={{ textAlign: "center", font: "16px" }}> Crawling...</p>
            </div>
          ) : (
            <p style={{ textAlign: "center" }}> complete <br /> Start: {valueTimep} <br /> End:{valueENDpp} </p>
          )}
        </div>
      </div>
  
      <h1>Summary</h1>
      <div className="Sum">
        <div className="collapse-content" style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Vulnerability</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
            {projectOneDataSQL.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.SQL) }} >SQL injection</td>
    <td>
      <select
      style={{ color: getColorForSeverity(editedSeverities.SQL) }}
        value={editedSeverities.SQL}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            SQL: e.target.value,
          })
        }
      >
        <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}

{projectOneDataXSS.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.XSS) }}>Stored Cross-Site Scripting</td>
    <td>
      <select
      style={{ color: getColorForSeverity(editedSeverities.XSS) }}
        value={editedSeverities.XSS}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            XSS: e.target.value,
          })
        }
      >
        <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}



{projectOneDataTravel.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.Travel) }}> Directory Traversal File Include</td>
    <td>
      <select
      style={{ color: getColorForSeverity(editedSeverities.Travel) }}
        value={editedSeverities.Travel}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            Travel: e.target.value,
          })
        }
      >
        <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}


{secure.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.Secure) }}>Missing Secure Attribute in Cookie Header</td>
    <td>
      <select
      style={{ color: getColorForSeverity(editedSeverities.Secure) }}
        value={editedSeverities.Secure}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            Secure: e.target.value,
          })
        }
      >
      <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}

{httponly.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.HttpOnly) }}>Missing HttpOnly Attribute in Cookie Header</td>
    <td>
      <select
       style={{ color: getColorForSeverity(editedSeverities.HttpOnly) }}
        value={editedSeverities.HttpOnly}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            HttpOnly: e.target.value,
          })
        }
      >
      <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}

{expire.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.Expire) }}>Missing Expires Attribute in Cookie Header</td>
    <td>
      <select
      style={{ color: getColorForSeverity(editedSeverities.Expire) }}
        value={editedSeverities.Expire}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            Expire: e.target.value,
          })
        }
      >
       <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}

{samsite.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.SameSite) }}>Missing SameSite Attribute in Cookie Header</td>
    <td>
      <select
      style={{ color: getColorForSeverity(editedSeverities.SameSite) }}
        value={editedSeverities.SameSite}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            SameSite: e.target.value,
          })
        }
      >
        <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}

{server.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.Server) }}>Web Server Information Leakage through 'Server' header</td>
    <td>
      <select
       style={{ color: getColorForSeverity(editedSeverities.Server) }}
        value={editedSeverities.Server}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            Server: e.target.value,
          })
        }
      >
      <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}

{HSTS.length > 0 && (
  <tr>
    <td style={{ color: getColorForSeverity(editedSeverities.HSTS) }}>HTTP Strict Transport Security (HSTS) Missing</td>
    <td>
      <select
      style={{ color: getColorForSeverity(editedSeverities.HSTS) }}
        value={editedSeverities.HSTS}
        onChange={(e) =>
          setEditedSeverities({
            ...editedSeverities,
            HSTS: e.target.value,
          })
        }
      >
      <option  style={{color:"#6F77B1"}}  value="Low">Low</option>
        <option style={{color:"#FFBB28"}}  value="Medium">Medium</option>
        <option style={{color:"#FF0000"}} value="High">High</option>
      </select>
    </td>
  </tr>
)}

  
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
                    }
export default Dashboard;
