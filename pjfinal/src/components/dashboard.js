// import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Label,Legend } from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Table,Button,Modal,Form,Input,Space,Card,theme,Collapse,ConfigProvider} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  CloseOutlined,
  FormOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import SQlinject from './SQlinject';
import {
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
  Label
} from "recharts";


const Dashboard = (props) => {
  console.log(props)
  const project_name =props.id
  const project_name_n = props.name

  const [start,setstart] = useState("")
  const [urlsAll, setUrlsAll] = useState([]);
  const [end,setend] = useState("")
  const [time,settiime] = useState("")


  const token = localStorage.getItem("token");
  const { project_name_id } = useParams();
  const [owaspData, setOwaspData] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [data, setData] = useState([]);
  const [total,settotal]= useState([]);
  const [totalmain,settotalmain]= useState([]);
  const [updatedSeverities, setUpdatedSeverities] = useState({});
  const [openCategory, setOpenCategory] = useState({});
  const [SeveritySQLCritical, setSeveritySQLCritical] = useState();
  const [SeveritySQLHigh, setSeveritySQLHigh] = useState();
  const [SeveritySQLMedium, setSeveritySQLMedium] = useState();
  const [SeveritySQLLow, setSeveritySQLLow] = useState();
  const [SeveritySQLUrlCritical, setSeveritySQLUrlCritical] = useState([]);
  const [SeveritySQLUrlHigh, setSeveritySQLUrlHigh] = useState([]);
  const [SeveritySQLUrlMedium, setSeveritySQLUrlMedium] = useState([]);
  const [SeveritySQLUrlLow, setSeveritySQLUrlLow] = useState([]);
  

  const [SeverityXSSCritical, setSeverityXSSCritical] = useState();
  const [SeverityXSSHigh, setSeverityXSSHigh] = useState();
  const [SeverityXSSMedium, setSeverityXSSMedium] = useState();
  const [SeverityXSSLow, setSeverityXSSLow] = useState();
  const [SeverityXSSUrlCritical, setSeverityXSSUrlCritical] = useState([]);
  const [SeverityXSSUrlHigh, setSeverityXSSUrlHigh] = useState([]);
  const [SeverityXSSUrlMedium, setSeverityXSSUrlMedium] = useState([]);
  const [SeverityXSSUrlLow, setSeverityXSSUrlLow] = useState([]);

  const [SeverityDirectoryCritical, setSeverityDirectoryCritical] = useState();
  const [SeverityDirectoryHigh, setSeverityDirectoryHigh] = useState();
  const [SeverityDirectoryMedium, setSeverityDirectoryMedium] = useState();
  const [SeverityDirectoryLow, setSeverityDirectoryLow] = useState();
  const [SeverityDirectoryUrlCritical, setSeverityDirectoryUrlCritical] = useState([]);
  const [SeverityDirectoryUrlHigh, setSeverityDirectoryUrlHigh] = useState([]);
  const [SeverityDirectoryUrlMedium, setSeverityDirectoryUrlMedium] = useState([]);
  const [SeverityDirectoryUrlLow, setSeverityDirectoryUrlLow] = useState([]);
  
  const [SeveritySecureCritical, setSeveritySecureCritical] = useState();
  const [SeveritySecureHigh, setSeveritySecureHigh] = useState();
  const [SeveritySecureMedium, setSeveritySecureMedium] = useState();
  const [SeveritySecureLow, setSeveritySecureLow] = useState();
  const [SeveritySecureUrlCritical, setSeveritySecureUrlCritical] = useState([]);
  const [SeveritySecureUrlHigh, setSeveritySecureUrlHigh] = useState([]);
  const [SeveritySecureUrlMedium, setSeveritySecureUrlMedium] = useState([]);
  const [SeveritySecureUrlLow, setSeveritySecureUrlLow] = useState([]);

  const [SeverityHttponlyCritical, setSeverityHttponlyCritical] = useState();
  const [SeverityHttponlyHigh, setSeverityHttponlyHigh] = useState();
  const [SeverityHttponlyMedium, setSeverityHttponlyMedium] = useState();
  const [SeverityHttponlyLow, setSeverityHttponlyLow] = useState();
  const [SeverityHttponlyUrlCritical, setSeverityHttponlyUrlCritical] = useState([]);
  const [SeverityHttponlyUrlHigh, setSeverityHttponlyUrlHigh] = useState([]);
  const [SeverityHttponlyUrlMedium, setSeverityHttponlyUrlMedium] = useState([]);
  const [SeverityHttponlyUrlLow, setSeverityHttponlyUrlLow] = useState([]);
  
  const [SeverityExpiresCritical, setSeverityExpiresCritical] = useState();
  const [SeverityExpiresHigh, setSeverityExpiresHigh] = useState();
  const [SeverityExpiresMedium, setSeverityExpiresMedium] = useState();
  const [SeverityExpiresLow, setSeverityExpiresLow] = useState();
  const [SeverityExpiresUrlCritical, setSeverityExpiresUrlCritical] = useState([]);
  const [SeverityExpiresUrlHigh, setSeverityExpiresUrlHigh] = useState([]);
  const [SeverityExpiresUrlMedium, setSeverityExpiresUrlMedium] = useState([]);
  const [SeverityExpiresUrlLow, setSeverityExpiresUrlLow] = useState([]);

    
  const [SeveritySamesiteCritical, setSeveritySamsiteCritical] = useState();
  const [SeveritySamesiteHigh, setSeveritySamsiteHigh] = useState();
  const [SeveritySamesiteMedium, setSeveritySamsiteMedium] = useState();
  const [SeveritySamesiteLow, setSeveritySamsiteLow] = useState();  
  const [SeveritySamesiteUrlCritical, setSeveritySamsiteUrlCritical] = useState([]);
  const [SeveritySamesiteUrlHigh, setSeveritySamsiteUrlHigh] = useState([]);
  const [SeveritySamesiteUrlMedium, setSeveritySamsiteUrlMedium] = useState([]);
  const [SeveritySamesiteUrlLow, setSeveritySamsiteUrlLow] = useState([]);
    
  const [SeverityServerCritical, setSeverityServerCritical] = useState();
  const [SeverityServerHigh, setSeverityServerHigh] = useState();
  const [SeverityServerMedium, setSeverityServerMedium] = useState();
  const [SeverityServerLow, setSeverityServerLow] = useState();
  const [SeverityServerUrlCritical, setSeverityServerUrlCritical] = useState([]);
  const [SeverityServerUrlHigh, setSeverityServerUrlHigh] = useState([]);
  const [SeverityServerUrlMedium, setSeverityServerUrlMedium] = useState([]);
  const [SeverityServerUrlLow, setSeverityServerUrlLow] = useState([]);



  
      
  const [SeverityHSTSCritical, setSeverityHSTSCritical] = useState();
  const [SeverityHSTSHigh, setSeverityHSTSHigh] = useState();
  const [SeverityHSTSMedium, setSeverityHSTSMedium] = useState();
  const [SeverityHSTSLow, setSeverityHSTSLow] = useState();
  const [SeverityHSTSUrlCritical, setSeverityHSTSUrlCritical] = useState();
  const [SeverityHSTSUrlHigh, setSeverityHSTSUrlHigh] = useState();
  const [SeverityHSTSUrlMedium, setSeverityHSTSUrlMedium] = useState();
  const [SeverityHSTSUrlLow, setSeverityHSTSUrlLow] = useState();

        

        
  const [SeveritySentitiveCritical, setSeveritySentitiveCritical] = useState();
  const [SeveritySentitiveHigh, setSeveritySentitiveHigh] = useState();
  const [SeveritySentitiveMedium, setSeveritySentitiveMedium] = useState();
  const [SeveritySentitiveLow, setSeveritySentitiveLow] = useState();
  const [SeveritySentitiveUrlCritical, setSeveritySentitiveUrlCritical] = useState();
  const [SeveritySentitiveUrlHigh, setSeveritySentitiveUrlHigh] = useState();
  const [SeveritySentitiveUrlMedium, setSeveritySentitiveUrlMedium] = useState();
  const [SeveritySentitiveUrlLow, setSeveritySentitiveUrlLow] = useState();
          
  const [SeverityWebCritical, setSeverityWebCritical] = useState();
  const [SeverityWebHigh, setSeverityWebHigh] = useState();
  const [SeverityWebMedium, setSeverityWebMedium] = useState();
  const [SeverityWebLow, setSeverityWebLow] = useState();
  const [SeverityWebUrlCritical, setSeverityWebUrlCritical] = useState();
  const [SeverityWebUrlHigh, setSeverityWebUrlHigh] = useState();
  const [SeverityWebUrlMedium, setSeverityWebUrlMedium] = useState();
  const [SeverityWebUrlLow, setSeverityWebUrlLow] = useState();


          
  const [SeverityCommandCritical, setSeverityCommandCritical] = useState();
  const [SeverityCommandHigh, setSeverityCommandHigh] = useState();
  const [SeverityCommandMedium, setSeverityCommandMedium] = useState();
  const [SeverityCommandLow, setSeverityCommandLow] = useState();
  const [SeverityCommandUrlCritical, setSeverityCommandUrlCritical] = useState();
  const [SeverityCommandUrlHigh, setSeverityCommandUrlHigh] = useState();
  const [SeverityCommandUrlMedium, setSeverityCommandUrlMedium] = useState();
  const [SeverityCommandUrlLow, setSeverityCommandUrlLow] = useState();
  const [Delete, setDelete] = useState("");





    
          console.log(owaspData);
          console.log(SeveritySentitiveHigh);
          console.log(SeveritySentitiveMedium);
          console.log(SeveritySentitiveLow);
          const fetchData = async () => {
            try {
              const response = await axios.get(
                `http://192.168.15.227:5000/dashboard?project_name_id=${project_name_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin' : '*',
                    'Content-Type': 'application/json'
                  },
                }
              )
             
              setDelete(response.data[4].Role);
              console.log(response.data[9].SeverityServer[3])
              if (response.data[1].SeveritySQL[0][0] === 0) {
                setSeveritySQLCritical(response.data[1].SeveritySQL[0][0]);
              } else {
                setSeveritySQLCritical(response.data[1].SeveritySQL[0].length);
                setSeveritySQLUrlCritical(response.data[1].SeveritySQL[0]);
              }
      
              if (response.data[1].SeveritySQL[1][0] === 0) {
                setSeveritySQLHigh(response.data[1].SeveritySQL[1][0]);
              } else {
                setSeveritySQLHigh(response.data[1].SeveritySQL[1].length);
                setSeveritySQLUrlHigh(response.data[1].SeveritySQL[1]);
              }
              
              if (response.data[1].SeveritySQL[2][0] === 0) {
                setSeveritySQLMedium(response.data[1].SeveritySQL[2][0]);
              } else {
                setSeveritySQLMedium(response.data[1].SeveritySQL[2].length);
                setSeveritySQLUrlMedium(response.data[1].SeveritySQL[2]);
              }
              
              if (response.data[1].SeveritySQL[3][0] === 0) {
                setSeveritySQLLow(response.data[1].SeveritySQL[3][0]);
              } else {
                setSeveritySQLLow(response.data[1].SeveritySQL[3].length);
                setSeveritySQLUrlLow(response.data[1].SeveritySQL[3]);
              }
              
      
      //-------------------------------------------------------------------------------
              if (response.data[2].SeverityXSS[0][0] === 0) {
                setSeverityXSSCritical(response.data[2].SeverityXSS[0][0]);
              } else {
                setSeverityXSSCritical(response.data[2].SeverityXSS[0].length);
                setSeverityXSSUrlCritical(response.data[2].SeverityXSS[0]);
              }
      
              if (response.data[2].SeverityXSS[1][0] === 0) {
                setSeverityXSSHigh(response.data[2].SeverityXSS[1][0]);
              } else {
                setSeverityXSSHigh(response.data[2].SeverityXSS[1].length);
                setSeverityXSSUrlHigh(response.data[2].SeverityXSS[1]);
              }
              
              if (response.data[2].SeverityXSS[2][0] === 0) {
                setSeverityXSSMedium(response.data[2].SeverityXSS[2][0]);
              } else {
                setSeverityXSSMedium(response.data[2].SeverityXSS[2].length);
                setSeverityXSSUrlMedium(response.data[2].SeverityXSS[2]);
              }
              if (response.data[2].SeverityXSS[3][0] === 0) {
                setSeverityXSSLow(response.data[2].SeverityXSS[3][0]);
              } else {
                setSeverityXSSLow(response.data[2].SeverityXSS[3].length);
                setSeverityXSSUrlLow(response.data[2].SeverityXSS[3]);
              }        
      
      //-------------------------------------------------------------------------------
      if (response.data[3].SeverityDirectory[0][0] === 0) {
        setSeverityDirectoryCritical(response.data[3].SeverityDirectory[0][0]);
      } else {
        setSeverityDirectoryCritical(response.data[3].SeverityDirectory[0].length);
        setSeverityDirectoryUrlCritical(response.data[3].SeverityDirectory[0]);
      }
      
      if (response.data[3].SeverityDirectory[1][0] === 0) {
        setSeverityDirectoryHigh(response.data[3].SeverityDirectory[1][0]);
      } else {
        setSeverityDirectoryHigh(response.data[3].SeverityDirectory[1].length);
        setSeverityDirectoryUrlHigh(response.data[3].SeverityDirectory[1]);
      }
      
      if (response.data[3].SeverityDirectory[2][0] === 0) {
        setSeverityDirectoryMedium(response.data[3].SeverityDirectory[2][0]);
      } else {
        setSeverityDirectoryMedium(response.data[3].SeverityDirectory[2].length);
        setSeverityDirectoryUrlMedium(response.data[3].SeverityDirectory[2]);
      }
      
      if (response.data[3].SeverityDirectory[3][0] === 0) {
        setSeverityDirectoryLow(response.data[3].SeverityDirectory[3][0]);
      } else {
        setSeverityDirectoryLow(response.data[3].SeverityDirectory[3].length);
        setSeverityDirectoryUrlLow(response.data[3].SeverityDirectory[3]);
      }
      
      
      
      //-------------------------------------------------------------------------------
      if (response.data[5].SeveritySecure[0][0] === 0) {
        setSeveritySecureCritical(response.data[5].SeveritySecure[0][0]);
      } else {
        setSeveritySecureCritical(response.data[5].SeveritySecure[0].length);
        setSeveritySecureUrlCritical(response.data[5].SeveritySecure[0]);
      }
      
      if (response.data[5].SeveritySecure[1][0] === 0) {
        setSeveritySecureHigh(response.data[5].SeveritySecure[1][0]);
      } else {
        setSeveritySecureHigh(response.data[5].SeveritySecure[1].length);
        setSeveritySecureUrlHigh(response.data[5].SeveritySecure[1]);
      }
      
      if (response.data[5].SeveritySecure[2][0] === 0) {
        setSeveritySecureMedium(response.data[5].SeveritySecure[2][0]);
      } else {
        setSeveritySecureMedium(response.data[5].SeveritySecure[2].length);
        setSeveritySecureUrlMedium(response.data[5].SeveritySecure[2]);
      }
      
      if (response.data[5].SeveritySecure[3][0] === 0) {
        setSeveritySecureLow(response.data[5].SeveritySecure[3][0]);
      } else {
        setSeveritySecureLow(response.data[5].SeveritySecure[3].length);
        setSeveritySecureUrlLow(response.data[5].SeveritySecure[3]);
      }
      
      //-------------------------------------------------------------------------------
      if (response.data[6].SeverityHttponly[0][0] === 0) {
        setSeverityHttponlyCritical(response.data[6].SeverityHttponly[0][0]);
      } else {
        setSeverityHttponlyCritical(response.data[6].SeverityHttponly[0].length);
        setSeverityHttponlyUrlCritical(response.data[6].SeverityHttponly[0]);
      }
      
      if (response.data[6].SeverityHttponly[1][0] === 0) {
        setSeverityHttponlyHigh(response.data[6].SeverityHttponly[1][0]);
      } else {
        setSeverityHttponlyHigh(response.data[6].SeverityHttponly[1].length);
        setSeverityHttponlyUrlHigh(response.data[6].SeverityHttponly[1]);
      }
      
      if (response.data[6].SeverityHttponly[2][0] === 0) {
        setSeverityHttponlyMedium(response.data[6].SeverityHttponly[2][0]);
      } else {
        setSeverityHttponlyMedium(response.data[6].SeverityHttponly[2].length);
        setSeverityHttponlyUrlMedium(response.data[6].SeverityHttponly[2]);
      }
      
      if (response.data[6].SeverityHttponly[3][0] === 0) {
        setSeverityHttponlyLow(response.data[6].SeverityHttponly[3][0]);
      } else {
        setSeverityHttponlyLow(response.data[6].SeverityHttponly[3].length);
        setSeverityHttponlyUrlLow(response.data[6].SeverityHttponly[3]);
      }
      
      
      //-------------------------------------------------------------------------------
      if (response.data[7].SeverityExpires[0][0] === 0) {
        setSeverityExpiresCritical(response.data[7].SeverityExpires[0][0]);
      } else {
        setSeverityExpiresCritical(response.data[7].SeverityExpires[0].length);
        setSeverityExpiresUrlCritical(response.data[7].SeverityExpires[0]);
      }
      
      if (response.data[7].SeverityExpires[1][0] === 0) {
        setSeverityExpiresHigh(response.data[7].SeverityExpires[1][0]);
      } else {
        setSeverityExpiresHigh(response.data[7].SeverityExpires[1].length);
        setSeverityExpiresUrlHigh(response.data[7].SeverityExpires[1]);
      }
      
      if (response.data[7].SeverityExpires[2][0] === 0) {
        setSeverityExpiresMedium(response.data[7].SeverityExpires[2][0]);
      } else {
        setSeverityExpiresMedium(response.data[7].SeverityExpires[2].length);
        setSeverityExpiresUrlMedium(response.data[7].SeverityExpires[2]);
      }
      
      if (response.data[7].SeverityExpires[3][0] === 0) {
        setSeverityExpiresLow(response.data[7].SeverityExpires[3][0]);
      } else {
        setSeverityExpiresLow(response.data[7].SeverityExpires[3].length);
        setSeverityExpiresUrlLow(response.data[7].SeverityExpires[3]);
      }
      
      //-------------------------------------------------------------------------------
      if (response.data[8].SeveritySamsite[0][0] === 0) {
        setSeveritySamsiteCritical(response.data[8].SeveritySamsite[0][0]);
      } else {
        setSeveritySamsiteCritical(response.data[8].SeveritySamsite[0].length);
        setSeveritySamsiteUrlCritical(response.data[8].SeveritySamsite[0]);
      }
      
      if (response.data[8].SeveritySamsite[1][0] === 0) {
        setSeveritySamsiteHigh(response.data[8].SeveritySamsite[1][0]);
      } else {
        setSeveritySamsiteHigh(response.data[8].SeveritySamsite[1].length);
        setSeveritySamsiteUrlHigh(response.data[8].SeveritySamsite[1]);
      }
      
      if (response.data[8].SeveritySamsite[2][0] === 0) {
        setSeveritySamsiteMedium(response.data[8].SeveritySamsite[2][0]);
      } else {
        setSeveritySamsiteMedium(response.data[8].SeveritySamsite[2].length);
        setSeveritySamsiteUrlMedium(response.data[8].SeveritySamsite[2]);
      }
      
      if (response.data[8].SeveritySamsite[3][0] === 0) {
        setSeveritySamsiteLow(response.data[8].SeveritySamsite[3][0]);
      } else {
        setSeveritySamsiteLow(response.data[8].SeveritySamsite[3].length);
        setSeveritySamsiteUrlLow(response.data[8].SeveritySamsite[3]);
      
        
      }
      //-------------------------------------------------------------------------------
      if (response.data[9].SeverityServer[0][0] === 0) {
        setSeverityServerCritical(response.data[9].SeverityServer[0][0]);
      } else {
        setSeverityServerCritical(response.data[9].SeverityServer[0].length);
        setSeverityServerUrlCritical(response.data[9].SeverityServer[0]);
      }
      
      if (response.data[9].SeverityServer[1][0] === 0) {
        setSeverityServerHigh(response.data[9].SeverityServer[1][0]);
      } else {
        setSeverityServerHigh(response.data[9].SeverityServer[1].length);
        setSeverityServerUrlHigh(response.data[9].SeverityServer[1]);
      }
      
      if (response.data[9].SeverityServer[2][0] === 0) {
        setSeverityServerMedium(response.data[9].SeverityServer[2][0]);
      } else {
        setSeverityServerMedium(response.data[9].SeverityServer[2].length);
        setSeverityServerUrlMedium(response.data[9].SeverityServer[2]);
      }
      
      if (response.data[9].SeverityServer[3][0] === 0) {
        setSeverityServerLow(response.data[9].SeverityServer[3][0]);
      } else {
        setSeverityServerLow(response.data[9].SeverityServer[3].length);
        setSeverityServerUrlLow(response.data[9].SeverityServer[3]);
      }
      //-------------------------------------------------------------------------------
      if (response.data[10].SeverityHSTS[0][0] === 0) {
        setSeverityHSTSCritical(response.data[10].SeverityHSTS[0][0]);
      } else {
        setSeverityHSTSCritical(response.data[10].SeverityHSTS[0].length);
        setSeverityHSTSUrlCritical(response.data[10].SeverityHSTS[0]);
      
      }
      
      if (response.data[10].SeverityHSTS[1][0] === 0) {
        setSeverityHSTSHigh(response.data[10].SeverityHSTS[1][0]);
      } else {
        setSeverityHSTSHigh(response.data[10].SeverityHSTS[1].length);
        setSeverityHSTSUrlHigh(response.data[10].SeverityHSTS[1]);
      }
      
      if (response.data[10].SeverityHSTS[2][0] === 0) {
        setSeverityHSTSMedium(response.data[10].SeverityHSTS[2][0]);
      } else {
        setSeverityHSTSMedium(response.data[10].SeverityHSTS[2].length);
        setSeverityHSTSUrlMedium(response.data[10].SeverityHSTS[2]);
      }
      
      if (response.data[10].SeverityHSTS[3][0] === 0) {
        setSeverityHSTSLow(response.data[10].SeverityHSTS[3][0]);
      } else {
        setSeverityHSTSLow(response.data[10].SeverityHSTS[3].length);
        setSeverityHSTSUrlLow(response.data[10].SeverityHSTS[3]);
      }
      
      //-------------------------------------------------------------------------------
      if (response.data[14].SeveritySentitive[0][0] === 0) {
        setSeveritySentitiveCritical(response.data[14].SeveritySentitive[0][0]);
      } else {
        setSeveritySentitiveCritical(response.data[14].SeveritySentitive[0].length);
        setSeveritySentitiveUrlCritical(response.data[14].SeveritySentitive[0]);
      }
      
      if (response.data[14].SeveritySentitive[1][0] === 0) {
        setSeveritySentitiveHigh(response.data[14].SeveritySentitive[1][0]);
      } else {
        setSeveritySentitiveHigh(response.data[14].SeveritySentitive[1].length);
        setSeveritySentitiveUrlHigh(response.data[14].SeveritySentitive[1]);
      }
      
      if (response.data[14].SeveritySentitive[2][0] === 0) {
        setSeveritySentitiveMedium(response.data[14].SeveritySentitive[2][0]);
      } else {
        setSeveritySentitiveMedium(response.data[14].SeveritySentitive[2].length);
        setSeveritySentitiveUrlMedium(response.data[14].SeveritySentitive[2]);
      }
      
      if (response.data[14].SeveritySentitive[3][0] === 0) {
        setSeveritySentitiveLow(response.data[14].SeveritySentitive[3][0]);
      } else {
        setSeveritySentitiveLow(response.data[14].SeveritySentitive[3].length);
        setSeveritySentitiveUrlLow(response.data[14].SeveritySentitive[3]);
      }
      
      
      
      //-------------------------------------------------------------------------------
      if (response.data[15].SeverityWeb[0][0] === 0) {
        setSeverityWebCritical(response.data[15].SeverityWeb[0][0]);
      } else {
        setSeverityWebCritical(response.data[15].SeverityWeb[0].length);
        setSeverityWebUrlCritical(response.data[15].SeverityWeb[0]);
      }
      
      if (response.data[15].SeverityWeb[1][0] === 0) {
        setSeverityWebHigh(response.data[15].SeverityWeb[1][0]);
      } else {
        setSeverityWebHigh(response.data[15].SeveritySentitive[1].length);
        setSeverityWebUrlHigh(response.data[15].SeveritySentitive[1]);
      }
      
      if (response.data[15].SeverityWeb[2][0] === 0) {
        setSeverityWebMedium(response.data[15].SeverityWeb[2][0]);
      } else {
        setSeverityWebMedium(response.data[15].SeverityWeb[2].length);
        setSeverityWebUrlMedium(response.data[15].SeverityWeb[2]);
      }
      
      
      if (response.data[15].SeverityWeb[3][0] === 0) {
        setSeverityWebLow(response.data[15].SeverityWeb[3][0]);
      } else {
        setSeverityWebLow(response.data[15].SeverityWeb[3].length);
        setSeverityWebUrlLow(response.data[15].SeverityWeb[3]);
      }
      
      
      //-------------------------------------------------------------------------------
      if (response.data[16].SeverityCommand[0][0] === 0) {
        setSeverityCommandCritical(response.data[16].SeverityCommand[0][0]);
      } else {
        setSeverityCommandCritical(response.data[16].SeverityCommand[0].length);
        setSeverityCommandUrlCritical(response.data[16].SeverityCommand[0]);
      }
      
      if (response.data[16].SeverityCommand[1][0] === 0) {
        setSeverityCommandHigh(response.data[16].SeverityCommand[1][0]);
      } else {
        setSeverityCommandHigh(response.data[16].SeverityCommand[1].length);
        setSeverityCommandUrlHigh(response.data[16].SeverityCommand[1]);
      }
      
      if (response.data[16].SeverityCommand[2][0] === 0) {
        setSeverityCommandMedium(response.data[16].SeverityCommand[2][0]);
      } else {
        setSeverityCommandMedium(response.data[16].SeverityCommand[2].length);
        setSeverityCommandUrlMedium(response.data[16].SeverityCommand[2]);
      }
      
      if (response.data[16].SeverityCommand[3][0] === 0) {
        setSeverityCommandLow(response.data[16].SeverityCommand[3][0]);
      } else {
        setSeverityCommandLow(response.data[16].SeverityCommand[3].length);
        setSeverityCommandUrlLow(response.data[16].SeverityCommand[3]);
      }
      // const subCategories = ["Critical", "High", "Medium", "Low"];
      // const data = datanumber.flatMap((category, index) =>
      //   subCategories.map((subCategory) => {
      //     const value = category.c.find((item) => item.name === subCategory)?.c ;
      
         
      //     if (value !== undefined) {
      //       return {
      //         name: `${category.name}`,
      //         mainCategory: category.name,
      //         subCategory: subCategory,
      //         value: value,
      //         isMainCategory: index === 0,
      //       };
      //     }
      //     return null; 
      //   })
      // );
      
      // const totalC = datanumber.reduce((total, category) => {
      //   category.c.forEach((subCategory) => {
      //       total += subCategory.c;
      //   });
      //   return total;
      // }, 0);

      // settotal(totalC)
      // console.log(totalC)
      // setData(data.filter((entry) => entry !== null));
      
      
      setstart(props.start)
      setUrlsAll(props.urlsAll)
      setend(props.end)
      settiime(props.time)
      
      setOwaspData(response.data[13].owasp_);
      
      
              if (response.data === "server error") {
                Swal.fire({
                  icon: "error",
                  title: "User Error",
                });
              }
      
              console.log(response);
            } catch (error) {
              // Handle error
              console.error("Error fetching data:", error);
            }
          };
          
          
          useEffect(()=>{
            fetchData();
          },[total])
  const datanumber = [
    { name: "SQL Injection",
     c: [
      { name: "Critical", c: SeveritySQLCritical,url:SeveritySQLUrlCritical },
      { name: "High", c: SeveritySQLHigh ,url:SeveritySQLUrlHigh},
      { name: "Medium", c:SeveritySQLMedium ,url:SeveritySQLUrlMedium},
      { name: "Low", c: SeveritySQLLow ,url:SeveritySQLUrlLow},
    ]},
    { name: "Reflected Cross Site Scripting",
    c: [
      { name: "Critical", c: SeverityXSSCritical,url:SeverityXSSUrlCritical },
      { name: "High", c: SeverityXSSHigh ,url:SeverityXSSUrlHigh},
      { name: "Medium", c: SeverityXSSMedium ,url:SeverityXSSUrlMedium},
      { name: "Low", c: SeverityXSSLow ,url: SeverityXSSUrlLow},
    ]},
    { name: "Directory Traversal File Include",
    c: [
      { name: "Critical", c: SeverityDirectoryCritical ,url:SeverityDirectoryUrlCritical},
      { name: "High", c: SeverityDirectoryHigh ,url:SeverityDirectoryUrlHigh},
      { name: "Medium", c: SeverityDirectoryMedium ,url:SeverityDirectoryUrlMedium},
      { name: "Low", c: SeverityDirectoryLow ,url:SeverityDirectoryUrlLow},
    ]},
    { name: "Sensitive File Disclosure",
    c: [
      { name: "Critical", c: SeveritySentitiveCritical ,url:SeveritySentitiveUrlCritical},
      { name: "High", c: SeveritySentitiveHigh,url:SeveritySentitiveUrlHigh},
      { name: "Medium", c: SeveritySentitiveMedium,url:SeveritySentitiveUrlMedium},
      { name: "Low", c: SeveritySentitiveLow,url: SeveritySentitiveUrlLow},
    ]},
    { name: "Missing HTTP Strict Transport Security Header",
    c: [
      { name: "Critical", c: SeverityHSTSCritical ,url:SeverityHSTSUrlCritical},
      { name: "High", c: SeverityHSTSHigh ,url: SeverityHSTSUrlHigh},
      { name: "Medium", c: SeverityHSTSMedium ,url:SeverityHSTSUrlMedium},
      { name: "Low", c: SeverityHSTSLow ,url:SeverityHSTSUrlLow },
    ]},
    { name: "Missing Secure Attribute in Cookie Header",
    c: [
      { name: "Critical", c: SeveritySecureCritical,url:SeveritySecureUrlCritical },
      { name: "High", c: SeveritySecureHigh,url: SeveritySecureUrlHigh},
      { name: "Medium", c: SeveritySecureMedium,url:SeveritySecureUrlMedium},
      { name: "Low", c: SeveritySecureLow,url:SeveritySecureUrlLow}
    ]},
    { name: "Missing HttpOnly Attribute in Cookie Header",
    c: [
      { name: "Critical", c: SeverityHttponlyCritical,url:SeverityHttponlyUrlCritical },
      { name: "High", c: SeverityHttponlyHigh,url:SeverityHttponlyUrlHigh },
      { name: "Medium", c: SeverityHttponlyMedium ,url:SeverityHttponlyUrlMedium},
      { name: "Low", c: SeverityHttponlyLow ,url:SeverityHttponlyUrlLow},
    ]},
    { name: "Missing Expires Attribute in Cookie Header",
    c: [
      { name: "Critical", c: SeverityExpiresCritical ,url:SeverityExpiresUrlCritical},
      { name: "High", c: SeverityExpiresHigh,url:SeverityExpiresUrlHigh},
      { name: "Medium", c: SeverityExpiresMedium,url:SeverityExpiresUrlMedium },
      { name: "Low", c: SeverityExpiresLow,url:SeverityExpiresUrlLow },
    ]},
    { name: "Missing SameSite Attribute in Cookie Header",
    c: [
      { name: "Critical", c: SeveritySamesiteCritical,url: SeveritySamesiteUrlCritical},
      { name: "High", c: SeveritySamesiteHigh,url: SeveritySamesiteUrlHigh},
      { name: "Medium", c: SeveritySamesiteMedium ,url:SeveritySamesiteUrlMedium},
      { name: "Low", c:SeveritySamesiteLow,url:SeveritySamesiteUrlLow },
    ]},
    { name: "Web Server Information Leakage through Server header",
    c: [
      { name: "Critical", c: SeverityServerCritical,url:SeverityServerUrlCritical },
      { name: "High", c: SeverityServerHigh,url:SeverityServerUrlHigh  },
      { name: "Medium", c: SeverityServerMedium,url:SeverityServerUrlMedium  },
      { name: "Low", c: SeverityServerLow ,url:SeverityServerUrlLow },
    ]},
    { name: "Web Application Framework Information Leakage",
    c: [
      { name: "Critical", c: SeverityWebCritical,url:SeverityWebUrlCritical},
      { name: "High", c: SeverityWebHigh,url: SeverityWebUrlHigh},
      { name: "Medium", c: SeverityWebMedium,url:SeverityWebUrlMedium},
      { name: "Low", c: SeverityWebLow,url:SeverityWebUrlLow },
    ]},
    { name: "Command Injection",
    c: [
      { name: "Critical", c: SeverityCommandCritical,url:SeverityCommandUrlCritical},
      { name: "High", c: SeverityCommandHigh ,url:SeverityCommandUrlHigh},
      { name: "Medium", c: SeverityCommandMedium ,url:SeverityCommandUrlMedium},
      { name: "Low", c: SeverityCommandLow ,url:SeverityCommandUrlLow},
    ]},

    
  ];

   
  const colors = ['#FF0000', '#FF5100', '#FFBB28', '#6F77B1'];
  const subCategories = ["Critical", "High", "Medium", "Low"]



  const transformedData = datanumber.reduce((acc, category) => {
    category.c.forEach((subCategory, subIndex) => {
        const key = `${category.name}`;
        const existingEntry = acc.find((entry) => entry.name === key);
 
        if (existingEntry) {
            existingEntry[`value_${subCategory.name.toLowerCase()}`] = subCategory.c;
            
; 
        } else {
            const newEntry = {
                name: key,
                [`value_${subCategory.name.toLowerCase()}`]: subCategory.c,
   
            };
            acc.push(newEntry);
        }
    });

    return acc;
  }, []);
  

  const totalsByCategory = subCategories.map(category => {
    const total = datanumber.reduce((acc, current) => {
        const subCategory = current.c.find(item => item.name === category);
        return acc + (subCategory ? subCategory.c : 0);
    }, 0);
    return total;
});


const barChartData = subCategories.map((category, index) => ({
    name: category,
    total: totalsByCategory[index],
    fill: colors[index]
}));

  


  
const totalC = datanumber.reduce((total, category) => {
  category.c.forEach((subCategory) => {
      total += subCategory.c;
  });
  return total;
}, 0);






const toggleCategory = (categoryName) => {
  setOpenCategory(prevState => ({
      ...prevState,
      [categoryName]: !prevState[categoryName]
  }));
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

    await axios.put(
      `http://192.168.15.227:5000/updateSeverity`,
      {
        project_name_id,
        vulnerability,
        newSeverity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin' : '*',
          'Content-Type': 'application/json'
        },
      }
    );
    fetchData();
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
      return '#23b842';
  }
};

const handleSeverityChange = (e, index, vulnerability) => {
  const newUpdatedSeverities = { ...updatedSeverities };
  newUpdatedSeverities[index] = e.target.value;
  setUpdatedSeverities(newUpdatedSeverities);
};

const handleDelete = async (iddelete) => {
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
      await axios.delete(
        `http://192.168.15.227:5000/oneSeverity?project_name_id=${project_name_id}&record=${iddelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'
          },
        }
      );
      fetchData();
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
    <div>
      <ResponsiveContainer width={850} height={400}>

    <h2 style={{ textAlign: 'center' }}>Scan Summary</h2>
    <BarChart data={barChartData} style={{ fontSize: "12px" }} layout="vertical">
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" />
    <Tooltip />
    <Legend payload={subCategories.map((category, index) => ({
      value: category,
      type: 'square',
      color: colors[index],
    }))} />
    <Bar dataKey="total" fill="#black" label={{ position: 'top' }} />
  </BarChart>
    <div className="dashboard-s2" style={{ marginTop: "50px"}}>
      {/* <h1 style={{ width: "50%" ,  margin: "0 auto" }}>Summary</h1> */}
      {owaspData.length > 0 && ( 
        <div>
          <div className="collapse-content">
            <table style={{  border: "1px solid #ccc",  margin: "0 auto" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Vulnerability</th>
                  <th style={{ textAlign: "left" }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {owaspData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ color: getColorForSeverity(item[1]), textAlign: "left" }}>
                      {index+1}. {item[0]}
                    </td>
                    <td style={{ textAlign: "left" }}>
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
      )}
    </div>
</ResponsiveContainer>
<div style={{ flex: 1, marginLeft: '900px', marginTop: '-360px', borderRadius: '10px', width: '500px' }}>
    <h2 style={{ textAlign: 'left', border: "1px solid #ccc", borderRadius: '10px 10px 0 0', padding: '5px 10px', fontSize: '16px' }}> Scan All URL :<h1 style={{ fontSize: '16px', color:"#1b317e"}}>{urlsAll}</h1> </h2>
    <h2 style={{ textAlign: 'left', border: "1px solid #ccc", padding: '5px 10px', fontSize: '16px' }}>All Vulnerabilities:<h1 style={{ fontSize: '16px', color:"#1b317e"}}> {totalC}</h1></h2>
    <h2 style={{ textAlign: 'left', border: "1px solid #ccc", padding: '5px 10px', fontSize: '16px' }}>Start Time: <h1 style={{ fontSize: '16px', color:"#1b317e"}}>{start}</h1></h2>
    <h2 style={{ textAlign: 'left', border: "1px solid #ccc", padding: '5px 10px', fontSize: '16px' }}>Finish Time: <h1 style={{ fontSize: '16px', color:"#1b317e"}}>{end}</h1></h2>
    <h2 style={{ textAlign: 'left', border: "1px solid #ccc", borderRadius: '0 0 10px 10px', padding: '5px 10px', fontSize: '16px' }}>Total Time:<h1 style={{ fontSize: '16px', color:"#1b317e"}}> {time}</h1></h2>
</div>
<div style={{ width: '100%', height: '400px', position: 'relative',marginTop: '500px' }}>
<ResponsiveContainer width={1470} height={400}>
      <BarChart data={transformedData} style={{ fontSize: "12px" }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    {subCategories.map((subCategory, index) => (
      <Bar
        key={`bar-${subCategory}-${index}`}
        dataKey={`value_${subCategory.toLowerCase()}`}
        fill={colors[index % colors.length]}
        label={{ position: "top" }}
      />
    ))}
    <Legend
      iconType="square"
      align="right"
      verticalAlign="middle"
      layout="vertical"
    />
  </BarChart>

      </ResponsiveContainer>
  

<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", border: "2px solid #ccc", padding: "5px", borderRadius: "20px", marginTop: "30px"}}>
<h1 className="heading">All Vulnerabilities: <span className="total">{totalC}</span></h1>
  <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
    {datanumber.map((category, index) => (
      <div key={`legend-${index}`} style={{ margin: "10px", marginLeft: "10px", flexBasis: "40%", border: "1px solid #ccc", padding: "10px" }}>
        <Button style={{ marginRight: "10px" }} onClick={() => toggleCategory(category.name)}>{category.name}</Button>
        <div>
          {category.c.map((subCategory, subIndex) => (
            <div key={`legend-sub-${subIndex}`} style={{ marginRight: "20px" }}>
              {subCategory.c !== 0 && (
                <span style={{ color: colors[subIndex % colors.length] }}>
                  <br/>{subCategory.name} ({subCategory.c})<br/>
                  {openCategory[category.name] && (
                    <>
                   {subCategory.url.map((url, urlIndex) => (
  <Link key={`link-${urlIndex}`} style={{ color: colors[subIndex % colors.length] }} to={`/myproject/${project_name_n}/${project_name_id}/tab4`}>
    {urlIndex + 1}. {decodeURIComponent(url[1])} <br/>
  </Link>
))}

                    </>
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
</div>
    


</div>
  );
  
                        }

export default Dashboard;