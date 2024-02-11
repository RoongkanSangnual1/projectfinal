import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css'
const Dashboard = () => {
  const { project_name_id } = useParams();
  const [projectOneDataSQL, setProjectOneDataSQL] = useState([]);
  const [projectOneDataXSS, setProjectOneDataXSS] = useState([]);
  const [projectOneDataTravel, setProjectOneDataTravel] = useState([]);
  const [httponly,sethttponly] = useState(0)
  const [expire,setexpire] = useState(0)
  const [samsite,setsamsite] = useState(0)
  const [secure,setsecure] = useState(0)
  const [server,setserver] = useState(0)
  const user = localStorage.user;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://127.0.0.1:5000/dashboard?project_name_id=${project_name_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => { 
      console.log(response)
      setProjectOneDataSQL(response.data[1].select_att_sql_DATA.filter(item=> item !== null));
      setProjectOneDataXSS(response.data[2].select_att_ID_xsssql_DATA.filter(item=> item !== null));
      setProjectOneDataTravel(response.data[3].select_att_ID_select_att_traversal_DATA.filter(item=> item !== null));
      sethttponly(response.data[6].select_att_ID_select_att_httponly_DATA.filter(item=> item !== null));
      setexpire(response.data[7].select_att_ID_select_att_expire_DATA.filter(item=> item !== null));
      setsamsite(response.data[8].select_att_ID_select_att_samsite_DATA.filter(item=> item !== null));
      setsecure(response.data[5].select_att_ID_select_att_secure_DATA.filter(item=> item !== null));
      setserver(response.data[9].select_att_ID_select_att_server_DATA.filter(item=> item !== null));
      console.log(server)
      
    })
    .catch(error => {
      console.error(error);
    });
  }, [user, project_name_id]); 

  const classifyVulnerabilities = () => {
    const counts = {
      high: projectOneDataSQL.length + projectOneDataXSS.length,
      medium: projectOneDataTravel.length,
      low:httponly.length+server.length+secure.length+samsite.length+expire.length,
    };
  
    return counts;
  };

  const vulnerabilityCounts = classifyVulnerabilities();
  const pieChartData = [
    { type: 'High', value: vulnerabilityCounts.high },
    { type: 'Medium', value: vulnerabilityCounts.medium },
    { type: 'Low', value: vulnerabilityCounts.low },
  ];
  const RADIAN = Math.PI / 180;
  const COLORS = ['#FF0000', '#FFBB28',  '#6F77B1 '];
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
    <div className='dashboardd'>
      <div className='dashboard'>
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
         <div className='highlight-container'>
        <div className='circle-red'></div>
        <p>high({ projectOneDataSQL.length + projectOneDataXSS.length})</p>
        <div className='circle-yellow'></div>
        <p>medium ({projectOneDataTravel.length})</p>
        <div className='circle-blue'></div>
        <p>low({httponly.length+server.length+secure.length+samsite.length+expire.length})</p>
      </div>
      </div>
      <h1>Summary</h1>
      <div className='Sum'>
      
      

        <div className="collapse-content" style={{ overflow: 'auto' }}>
          <table>
          <thead>
              <tr>
                <th>Vulnerability</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {projectOneDataSQL.length>0 &&( <tr>
                <td>SQL injection</td>
                <td style={{color:"#FF0000"}}> High</td>
                </tr>)}

            {projectOneDataXSS.length>0 &&( <tr>
              <td>  Stored Cross Site Scriptng     </td>
              <td style={{color:"#FF0000"}}> High</td>
       
            </tr>)}
            {projectOneDataTravel.length>0 &&(<tr>
              <td >
              Directory Traversal File Include
              </td>
              <td style={{color:" #FFBB28"}}>
                Medium
              </td>
            </tr>)}
            {secure.length>0 &&(<tr>
              <td >
              Missing Secure Attribute in Cookie Header
              </td>
              <td style={{color:" #6F77B1"}}>
                Low
              </td>
            </tr>)}
            {httponly.length>0 &&(<tr>
              <td >
              Missing HttpOnly Attribute in Cookie Header
              </td>
              <td style={{color:" #6F77B1"}}>
                Low
              </td>
            </tr>)}
            {expire.length>0 &&(<tr>
              <td >
              Missing Expires Attribute in Cookie Header
              </td>
              <td style={{color:" #6F77B1"}}>
                Low
              </td>
            </tr>)}
            {samsite.length>0 &&(<tr>
              <td >
              Missing SameSite Attribute in Cookie Header
              </td>
              <td style={{color:" #6F77B1"}}>
                Low
              </td>
            </tr>)}
            {server.length>0 &&(<tr>
              <td >
              Web Server Infomation Leakage through 'Server' header
              </td>
              <td style={{color:" #6F77B1"}}>
                Low
              </td>
            </tr>)}
            </tbody>
            </table>
            </div>
          
     
        </div>
      </div>

  );
  
};

export default Dashboard;
