
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css'
import Sidemenu from './sidemenu';
import Navbar from './navbar';
import { FormOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import ClockLoader from "react-spinners/ClockLoader";
import { IoEarth } from "react-icons/io5";
import { MdOutlineExpandMore } from "react-icons/md";
import Swal from 'sweetalert2'
const DashboardAll = () => {
  const { project_name_id } = useParams();
  // const [projectOneData, setProjectOneData] = useState({ data10: [], data11: [],data4:[] ,data2:[] ,data3:[] ,data5:[] ,data6:[] ,data1:[],data8:[]});
  const [alldata, setAlldata] = useState([]);
  const [High, setHigh] = useState([]);
  const [Medium, setMedium] = useState([]);
  const [Low, setLow] = useState([]);
  const [Critical, setCritical] = useState([]);
  const [projectOneDataTravel, setProjectOneDataTravel] = useState([]);
  const [time, Settime] = useState([]);
  const user = localStorage.user;
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate()

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };
  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log(token)
    axios.get(`http://localhost:5000/DashboardAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin' : '*',
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.data && response.data["server error"]) {
          navigate('/login')
          Swal.fire({
            icon: 'error',
            title: 'User Eror',
            // text: "User Eror",
          });

        }
        console.log(response)
        Settime(response.data[1].time)
        const data = response.data[2].owasp_data2
        const result = {};

        data.forEach(array => {
          const [PName, PTarget, Vulname, URL, PID, Severity] = array;
          if (Vulname === "Stored Cross Site Scriptng" || Vulname === "SQL Injection" || Vulname === "Directory Traversal File Include" || Vulname === "Web Server Infomation Leakage through Server header" || Vulname === "Missing Secure Attribute in Cookie Header" || Vulname === "Missing HttpOnly Attribute in Cookie Header" || Vulname === "Missing Expires Attribute in Cookie Header" || Vulname === "Missing SameSite Attribute in Cookie Header" || Vulname === "Missing HTTP Strict Transport Security Header" || Vulname === "Sensitive File Disclosure" || Vulname === "Command Injection" || Vulname === "Web Application Framework Infomation Leakage") {
            if (!result[PID]) {
              result[PID] = { PName, PTarget, PID };
            }

            if (!result[PID][`data ${Vulname}`]) {
              result[PID][`data ${Vulname}`] = [Severity];
            }

            result[PID][`data ${Vulname}`].push(URL);
          }
        });

        const finalResult = Object.values(result);



        let sumAllCritical = 0;
        let sumAllHigh = 0;
        let sumAllMedium = 0;
        let sumAllLow = 0;

        finalResult.forEach(data => {
          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "Critical") {
              sumAllCritical += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Web Server Infomation Leakage through Server header"]) {
            if (data["data Web Server Infomation Leakage through Server header"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }
          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }

          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "Critical") {
              sumAllCritical += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }








          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "High") {
              sumAllHigh += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "High") {
              sumAllHigh += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "High") {
              sumAllHigh += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "High") {
              sumAllHigh += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "High") {
              sumAllHigh += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "High") {
              sumAllHigh += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "High") {
              sumAllHigh += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "High") {
              sumAllHigh += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Web Server Infomation Leakage through Server header"]) {
            if (data["data Web Server Infomation Leakage through Server header"][0] === "High") {
              sumAllHigh += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }
          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "High") {
              sumAllHigh += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "High") {
              sumAllHigh += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }

          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "High") {
              sumAllHigh += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }





          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "Medium") {
              sumAllMedium += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["Web Server Infomation Leakage through Server header"]) {
            if (data["Web Server Infomation Leakage through Server header"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }
          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }


          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "Medium") {
              sumAllMedium += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }


          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "Low") {
              sumAllLow += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "Low") {
              sumAllLow += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "Low") {
              sumAllLow += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "Low") {
              sumAllLow += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "Low") {
              sumAllLow += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Low") {
              sumAllLow += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "Low") {
              sumAllLow += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "Low") {
              sumAllLow += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Web Server Infomation Leakage through Server header"]) {
            if (data["data Web Server Infomation Leakage through Server header"][0] === "Low") {
              sumAllLow += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }

          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "Low") {
              sumAllLow += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "Low") {
              sumAllLow += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }
          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "Low") {
              sumAllLow += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }
        });
        setHigh(sumAllHigh)
        setMedium(sumAllMedium)
        setLow(sumAllLow)
        setCritical(sumAllCritical)
        console.log("sumAllHigh:", sumAllHigh);
        console.log("sumAllHigh:", sumAllMedium);
        console.log("sumAllHigh:", sumAllLow);


        finalResult.forEach((data, index) => {

          let sumAll = 0;
          console.log((data.PName))
          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "Critical") {
              sumAll += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "Critical") {
              sumAll += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "Critical") {
              sumAll += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "Critical") {
              sumAll += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "Critical") {
              sumAll += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Critical") {
              sumAll += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "Critical") {
              sumAll += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "Critical") {
              sumAll += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Web Server Infomation Leakage through Server header"]) {
            if (data["data Web Server Infomation Leakage through Server header"][0] === "Critical") {
              sumAll += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }
          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "Critical") {
              sumAll += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "Critical") {
              sumAll += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }

          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "Critical") {
              sumAll += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }






          console.log(Math.max((data["data SQL Injection"] || []).length - 1, 0))
          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "High") {
              sumAll += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "High") {
              sumAll += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "High") {
              sumAll += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "High") {
              sumAll += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "High") {
              sumAll += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "High") {
              sumAll += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "High") {
              sumAll += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "High") {
              sumAll += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Web Server Infomation Leakage through Server header"]) {
            if (data["data Web Server Infomation Leakage through Server header"][0] === "High") {
              sumAll += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }
          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "High") {
              sumAll += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "High") {
              sumAll += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }

          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "High") {
              sumAll += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }

          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "Medium") {
              sumAll += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "Medium") {
              sumAll += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "Medium") {
              sumAll += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "Medium") {
              sumAll += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "Medium") {
              sumAll += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Medium") {
              sumAll += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "Medium") {
              sumAll += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "Medium") {
              sumAll += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["Web Server Infomation Leakage through Server header"]) {
            if (data["Web Server Infomation Leakage through Server header"][0] === "Medium") {
              sumAll += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }
          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "Medium") {
              sumAll += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "Medium") {
              sumAll += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }


          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "Medium") {
              sumAll += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }


          if (data["data SQL Injection"]) {
            if (data["data SQL Injection"][0] === "Low") {
              sumAll += Math.max((data["data SQL Injection"] || []).length - 1, 0);
            }
          }
          if (data["data Stored Cross Site Scriptng"]) {
            if (data["data Stored Cross Site Scriptng"][0] === "Low") {
              sumAll += Math.max((data["data Stored Cross Site Scriptng"] || []).length - 1, 0);
            }
          }

          if (data["data Directory Traversal File Include"]) {
            if (data["data Directory Traversal File Include"][0] === "Low") {
              sumAll += Math.max((data["data Directory Traversal File Include"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HTTP Strict Transport Security Header"]) {
            if (data["data Missing HTTP Strict Transport Security Header"][0] === "Low") {
              sumAll += Math.max((data["data Missing HTTP Strict Transport Security Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Secure Attribute in Cookie Header"]) {
            if (data["data Missing Secure Attribute in Cookie Header"][0] === "Low") {
              sumAll += Math.max((data["data Missing Secure Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing HttpOnly Attribute in Cookie Header"]) {
            if (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Low") {
              sumAll += Math.max((data["data Missing HttpOnly Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing Expires Attribute in Cookie Header"]) {
            if (data["data Missing Expires Attribute in Cookie Header"][0] === "Low") {
              sumAll += Math.max((data["data Missing Expires Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Missing SameSite Attribute in Cookie Header"]) {
            if (data["data Missing SameSite Attribute in Cookie Header"][0] === "Low") {
              sumAll += Math.max((data["data Missing SameSite Attribute in Cookie Header"] || []).length - 1, 0);
            }
          }
          if (data["data Web Server Infomation Leakage through Server header"]) {
            if (data["data Web Server Infomation Leakage through Server header"][0] === "Low") {
              sumAll += Math.max((data["data Web Server Infomation Leakage through Server header"] || []).length - 1, 0);
            }
          }

          if (data["data Sensitive File Disclosure"]) {
            if (data["data Sensitive File Disclosure"][0] === "Low") {
              sumAll += Math.max((data["data Sensitive File Disclosure"] || []).length - 1, 0);
            }
          }

          if (data["data Web Application Framework Infomation Leakage"]) {
            if (data["data Web Application Framework Infomation Leakage"][0] === "Low") {
              sumAll += Math.max((data["data Web Application Framework Infomation Leakage"] || []).length - 1, 0);
            }
          }
          if (data["data Command Injection"]) {
            if (data["data Command Injection"][0] === "Low") {
              sumAll += Math.max((data["data Command Injection"] || []).length - 1, 0);
            }
          }

          if (!finalResult[index].sums) {
            finalResult[index].sums = {};
          }
          finalResult[index].sums['sum'] = sumAll;
        });
        setAlldata(finalResult)
        console.log(finalResult)
        console.log("alldata", alldata)
        // console.log("Sum10:", sum10);
        // console.log("Sum8:", sum8);
        // console.log("Sum2:", sum2);
        // console.log("Sum4:", sum4);
        // console.log("Sum3:", sum3);
        // console.log("Sum5:", sum5);
        // console.log("Sum6:", sum6);
        // console.log("Sum1:", sum1);

      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const classifyVulnerabilities = () => {
    const counts = {
      Critical:Critical,
      high: High,
      medium: Medium,
      low: Low
    };

    return counts;
  };


  const vulnerabilityCounts = classifyVulnerabilities();
  const pieChartData = [
    { type: 'Critical', value: vulnerabilityCounts.Critical },
    { type: 'High', value: vulnerabilityCounts.high },
    { type: 'Medium', value: vulnerabilityCounts.medium },
    { type: 'Low', value: vulnerabilityCounts.low },
  ];
  const RADIAN = Math.PI / 180;
  const COLORS = ["#FF0000","#FF5100", "#FFBB28", "#6F77B1"];
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
    <div>
      <Navbar />
      <div className='dashboard-All'>
        <Sidemenu />
        <div className='content-container'>
          <h1 style={{ color: '#1B337A' }}>Dashboard</h1>
          <div className='dashboardAll-s1'>
            <div className='dashboardAll-s1-c1'>
              <h1 style={{ color: '#1B337A' }}>Current Issue</h1>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="30%"
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

              <div className='highlightAll-container'>
              <div className='circle-redd'></div>
                <p>Critical </p>
                <p >({Critical})</p>
                <div className='circle-orangee'></div>
                <p>High </p>
                <p >({High})</p>
                <div className='circle-yelloww'></div>
                <p>Medium</p>
                <p >({Medium}) </p>
                <div className='circle-bluee'></div>
                <p>Low</p>
                <p >({Low}) </p>
              </div>
            </div>
            <div className='dashboardAll-s1-c2'>
              <h1 style={{ color: '#1B337A' }}>Current Process</h1>
              {time === 1 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: '#1B337A' }}>
                  <ClockLoader
                    color={"#36d7b7"}
                    loading={true}
                    size={200}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  <p style={{ textAlign: "center", color: '#1B337A' }}> Crawling...</p>
                </div>

              ) : (
                <p style={{ textAlign: "center" }}> complete </p>
              )}
            </div>

          </div>
          <h1 style={{ color: '#1B337A' }}>Most vulnerability</h1>
          <div className='dashboardAll-s2'>
            
            {alldata
              .sort((a, b) => b.sums.sum - a.sums.sum)
              .map((data, index) => (
                <Link className="dashboardAll-s2-proj-b" to={`/myproject/${data.PName}/${data.PID}`}>
                  <div className='dashboardAll-s2-proj-b-cc' key={index}>

                    <div className='dashboardAll-s2-proj-b-c1'>
                      <div className="project-link-container">
                        <IoEarth className="earth-icon" />
                        <p className="project-name">{data.PName} : {data.PTarget} </p>

                      </div>

                    </div>
                    <div className='dashboardAll-s2-proj-b-c2'>
                    <div className='circle-redminii'>
                        {/* <p className='circle-text'>{data["data SQL Injection"].length-1 + data["data Stored Cross Site Scriptng"].length-1}</p> */}
                        <p className='circle-text'>
                          {
                            (data["data SQL Injection"] ? (data["data SQL Injection"][0] === "Critical" ? data["data SQL Injection"].length - 1 : 0) : 0) +
                            (data["data Stored Cross Site Scriptng"] ? (data["data Stored Cross Site Scriptng"][0] === "Critical" ? data["data Stored Cross Site Scriptng"].length - 1 : 0) : 0) +
                            (data["data Directory Traversal File Include"] ? (data["data Directory Traversal File Include"][0] === "Critical" ? data["data Directory Traversal File Include"].length - 1 : 0) : 0) +
                            (data["data Missing HTTP Strict Transport Security Header"] ? (data["data Missing HTTP Strict Transport Security Header"][0] === "Critical" ? data["data Missing HTTP Strict Transport Security Header"].length - 1 : 0) : 0) +
                            (data["data Missing Secure Attribute in Cookie Header"] ? (data["data Missing Secure Attribute in Cookie Header"][0] === "Critical" ? data["data Missing Secure Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing HttpOnly Attribute in Cookie Header"] ? (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Critical" ? data["data Missing HttpOnly Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing Expires Attribute in Cookie Header"] ? (data["data Missing Expires Attribute in Cookie Header"][0] === "Critical" ? data["data Missing Expires Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing SameSite Attribute in Cookie Header"] ? (data["data Missing SameSite Attribute in Cookie Header"][0] === "Critical" ? data["data Missing SameSite Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Web Server Infomation Leakage through Server header"] ? (data["data Web Server Infomation Leakage through Server header"][0] === "Critical" ? data["data Web Server Infomation Leakage through Server header"].length - 1 : 0) : 0) +
                            (data["data Sensitive File Disclosure"] ? (data["data Sensitive File Disclosure"][0] === "Critical" ? data["data Sensitive File Disclosure"].length - 1 : 0) : 0) +
                            (data["data Web Application Framework Infomation Leakage"] ? (data["data Web Application Framework Infomation Leakage"][0] === "Critical" ? data["data Web Application Framework Infomation Leakage"].length - 1 : 0) : 0) +
                            (data["data Command Injection"] ? (data["data Command Injection"][0] === "Critical" ? data["data Command Injection"].length - 1 : 0) : 0)
                          }
                        </p>

                      </div>
                      <div className='circle-redmini'>
                        {/* <p className='circle-text'>{data["data SQL Injection"].length-1 + data["data Stored Cross Site Scriptng"].length-1}</p> */}
                        <p className='circle-text'>
                          {
                            (data["data SQL Injection"] ? (data["data SQL Injection"][0] === "High" ? data["data SQL Injection"].length - 1 : 0) : 0) +
                            (data["data Stored Cross Site Scriptng"] ? (data["data Stored Cross Site Scriptng"][0] === "High" ? data["data Stored Cross Site Scriptng"].length - 1 : 0) : 0) +
                            (data["data Directory Traversal File Include"] ? (data["data Directory Traversal File Include"][0] === "High" ? data["data Directory Traversal File Include"].length - 1 : 0) : 0) +
                            (data["data Missing HTTP Strict Transport Security Header"] ? (data["data Missing HTTP Strict Transport Security Header"][0] === "High" ? data["data Missing HTTP Strict Transport Security Header"].length - 1 : 0) : 0) +
                            (data["data Missing Secure Attribute in Cookie Header"] ? (data["data Missing Secure Attribute in Cookie Header"][0] === "High" ? data["data Missing Secure Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing HttpOnly Attribute in Cookie Header"] ? (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "High" ? data["data Missing HttpOnly Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing Expires Attribute in Cookie Header"] ? (data["data Missing Expires Attribute in Cookie Header"][0] === "High" ? data["data Missing Expires Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing SameSite Attribute in Cookie Header"] ? (data["data Missing SameSite Attribute in Cookie Header"][0] === "High" ? data["data Missing SameSite Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Web Server Infomation Leakage through Server header"] ? (data["data Web Server Infomation Leakage through Server header"][0] === "High" ? data["data Web Server Infomation Leakage through Server header"].length - 1 : 0) : 0) +
                            (data["data Sensitive File Disclosure"] ? (data["data Sensitive File Disclosure"][0] === "High" ? data["data Sensitive File Disclosure"].length - 1 : 0) : 0) +
                            (data["data Web Application Framework Infomation Leakage"] ? (data["data Web Application Framework Infomation Leakage"][0] === "High" ? data["data Web Application Framework Infomation Leakage"].length - 1 : 0) : 0) +
                            (data["data Command Injection"] ? (data["data Command Injection"][0] === "High" ? data["data Command Injection"].length - 1 : 0) : 0)
                          }
                        </p>

                      </div>
                      <div className='circle-yellowmini'>
                        <p className='circle-text'>
                          {
                            (data["data SQL Injection"] ? (data["data SQL Injection"][0] === "Medium" ? data["data SQL Injection"].length - 1 : 0) : 0) +
                            (data["data Stored Cross Site Scriptng"] ? (data["data Stored Cross Site Scriptng"][0] === "Medium" ? data["data Stored Cross Site Scriptng"].length - 1 : 0) : 0) +
                            (data["data Directory Traversal File Include"] ? (data["data Directory Traversal File Include"][0] === "Medium" ? data["data Directory Traversal File Include"].length - 1 : 0) : 0) +
                            (data["data Missing HTTP Strict Transport Security Header"] ? (data["data Missing HTTP Strict Transport Security Header"][0] === "Medium" ? data["data Missing HTTP Strict Transport Security Header"].length - 1 : 0) : 0) +
                            (data["data Missing Secure Attribute in Cookie Header"] ? (data["data Missing Secure Attribute in Cookie Header"][0] === "Medium" ? data["data Missing Secure Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing HttpOnly Attribute in Cookie Header"] ? (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Medium" ? data["data Missing HttpOnly Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing SameSite Attribute in Cookie Header"] ? (data["data Missing SameSite Attribute in Cookie Header"][0] === "Medium" ? data["data Missing SameSite Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing Expires Attribute in Cookie Header"] ? (data["data Missing Expires Attribute in Cookie Header"][0] === "Medium" ? data["data Missing Expires Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Web Server Infomation Leakage through Server header"] ? (data["data Web Server Infomation Leakage through Server header"][0] === "Medium" ? data["data Web Server Infomation Leakage through Server header"].length - 1 : 0) : 0) +
                            (data["data Sensitive File Disclosure"] ? (data["data Sensitive File Disclosure"][0] === "Medium" ? data["data Sensitive File Disclosure"].length - 1 : 0) : 0) +
                            (data["data Web Application Framework Infomation Leakage"] ? (data["data Web Application Framework Infomation Leakage"][0] === "Medium" ? data["data Web Application Framework Infomation Leakage"].length - 1 : 0) : 0) +
                            (data["data Command Injection"] ? (data["data Command Injection"][0] === "Medium" ? data["data Command Injection"].length - 1 : 0) : 0)
                          }
                        </p>
                      </div>
                      <div className='circle-bluemini'>
                        <p className='circle-text'>
                          {
                            (data["data SQL Injection"] ? (data["data SQL Injection"][0] === "Low" ? data["data SQL Injection"].length - 1 : 0) : 0) +
                            (data["data Stored Cross Site Scriptng"] ? (data["data Stored Cross Site Scriptng"][0] === "Low" ? data["data Stored Cross Site Scriptng"].length - 1 : 0) : 0) +
                            (data["data Directory Traversal File Include"] ? (data["data Directory Traversal File Include"][0] === "Low" ? data["data Directory Traversal File Include"].length - 1 : 0) : 0) +
                            (data["data Missing HTTP Strict Transport Security Header"] ? (data["data Missing HTTP Strict Transport Security Header"][0] === "Low" ? data["data Missing HTTP Strict Transport Security Header"].length - 1 : 0) : 0) +
                            (data["data Missing Secure Attribute in Cookie Header"] ? (data["data Missing Secure Attribute in Cookie Header"][0] === "Low" ? data["data Missing Secure Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing HttpOnly Attribute in Cookie Header"] ? (data["data Missing HttpOnly Attribute in Cookie Header"][0] === "Low" ? data["data Missing HttpOnly Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing SameSite Attribute in Cookie Header"] ? (data["data Missing SameSite Attribute in Cookie Header"][0] === "Low" ? data["data Missing SameSite Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Missing Expires Attribute in Cookie Header"] ? (data["data Missing Expires Attribute in Cookie Header"][0] === "Low" ? data["data Missing Expires Attribute in Cookie Header"].length - 1 : 0) : 0) +
                            (data["data Web Server Infomation Leakage through Server header"] ? (data["data Web Server Infomation Leakage through Server header"][0] === "Low" ? data["data Web Server Infomation Leakage through Server header"].length - 1 : 0) : 0) +
                            (data["data Sensitive File Disclosure"] ? (data["data Sensitive File Disclosure"][0] === "Low" ? data["data Sensitive File Disclosure"].length - 1 : 0) : 0) +
                            (data["data Web Application Framework Infomation Leakage"] ? (data["data Web Application Framework Infomation Leakage"][0] === "Low" ? data["data Web Application Framework Infomation Leakage"].length - 1 : 0) : 0) +
                            (data["data Command Injection"] ? (data["data Command Injection"][0] === "Low" ? data["data Command Injection"].length - 1 : 0) : 0)
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            {/* {alldata.length > visibleCount && (
      <>
         <MdOutlineExpandMore className="show-more-btn" onClick={handleShowMore} />
         </>
      )} */}




          </div>

        </div>
      </div>

    </div>
  );

};

export default DashboardAll;
