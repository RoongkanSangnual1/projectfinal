import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Label } from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";



const Dashboard = () => {
  const token = localStorage.getItem("token");
  const { project_name_id } = useParams();

  const [data, setData] = useState([]);
  const [SeveritySQLCritical, setSeveritySQLCritical] = useState();
  const [SeveritySQLHigh, setSeveritySQLHigh] = useState();
  const [SeveritySQLMedium, setSeveritySQLMedium] = useState();
  const [SeveritySQLLow, setSeveritySQLLow] = useState();

  const [SeverityXSSCritical, setSeverityXSSCritical] = useState();
  const [SeverityXSSHigh, setSeverityXSSHigh] = useState();
  const [SeverityXSSMedium, setSeverityXSSMedium] = useState();
  const [SeverityXSSLow, setSeverityXSSLow] = useState();

  const [SeverityDirectoryCritical, setSeverityDirectoryCritical] = useState();
  const [SeverityDirectoryHigh, setSeverityDirectoryHigh] = useState();
  const [SeverityDirectoryMedium, setSeverityDirectoryMedium] = useState();
  const [SeverityDirectoryLow, setSeverityDirectoryLow] = useState();


  
  const [SeveritySecureCritical, setSeveritySecureCritical] = useState();
  const [SeveritySecureHigh, setSeveritySecureHigh] = useState();
  const [SeveritySecureMedium, setSeveritySecureMedium] = useState();
  const [SeveritySecureLow, setSeveritySecureLow] = useState();


  const [SeverityHttponlyCritical, setSeverityHttponlyCritical] = useState();
  const [SeverityHttponlyHigh, setSeverityHttponlyHigh] = useState();
  const [SeverityHttponlyMedium, setSeverityHttponlyMedium] = useState();
  const [SeverityHttponlyLow, setSeverityHttponlyLow] = useState();

  const colors = ['#FF0000', '#FF5100', '#FFBB28', '#6F77B1'];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/dashboard?project_name_id=${project_name_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
        ;

        if (response.data[1].SeveritySQL[0][0] === 0) {
          setSeveritySQLCritical(response.data[1].SeveritySQL[0][0]);
        } else {
          setSeveritySQLCritical(response.data[1].SeveritySQL[0].length);
        }

        if (response.data[1].SeveritySQL[1][0] === 0) {
          setSeveritySQLHigh(response.data[1].SeveritySQL[1][0]);
        } else {
          setSeveritySQLHigh(response.data[1].SeveritySQL[1].length);
        }
        
        if (response.data[1].SeveritySQL[2][0] === 0) {
          setSeveritySQLMedium(response.data[1].SeveritySQL[2][0]);
        } else {
          setSeveritySQLMedium(response.data[1].SeveritySQL[2].length);
        }
        
        if (response.data[1].SeveritySQL[3][0] === 0) {
          setSeveritySQLLow(response.data[1].SeveritySQL[3][0]);
        } else {
          setSeveritySQLLow(response.data[1].SeveritySQL[3].length);
        }
        

//-------------------------------------------------------------------------------
        if (response.data[2].SeverityXSS[0][0] === 0) {
          setSeverityXSSCritical(response.data[2].SeverityXSS[0][0]);
        } else {
          setSeverityXSSCritical(response.data[2].SeverityXSS[0].length);
        }

        if (response.data[2].SeverityXSS[1][0] === 0) {
          setSeverityXSSHigh(response.data[2].SeverityXSS[1][0]);
        } else {
          setSeverityXSSHigh(response.data[2].SeverityXSS[1].length);
        }
        
        if (response.data[2].SeverityXSS[2][0] === 0) {
          setSeverityXSSMedium(response.data[2].SeverityXSS[2][0]);
        } else {
          setSeverityXSSMedium(response.data[2].SeverityXSS[2].length);
        }
        
        if (response.data[2].SeverityXSS[3][0] === 0) {
          setSeverityXSSLow(response.data[2].SeverityXSS[3][0]);
        } else {
          setSeverityXSSLow(response.data[2].SeverityXSS[3].length);
        }
        

//-------------------------------------------------------------------------------
if (response.data[3].SeverityDirectory[0][0] === 0) {
  setSeverityDirectoryCritical(response.data[3].SeverityDirectory[0][0]);
} else {
  setSeverityDirectoryCritical(response.data[3].SeverityDirectory[0].length);
}

if (response.data[3].SeverityDirectory[1][0] === 0) {
  setSeverityDirectoryHigh(response.data[3].SeverityDirectory[1][0]);
} else {
  setSeverityDirectoryHigh(response.data[3].SeverityDirectory[1].length);
}

if (response.data[3].SeverityDirectory[2][0] === 0) {
  setSeverityDirectoryMedium(response.data[3].SeverityDirectory[2][0]);
} else {
  setSeverityDirectoryMedium(response.data[3].SeverityDirectory[2].length);
}

if (response.data[3].SeverityDirectory[3][0] === 0) {
  setSeverityDirectoryLow(response.data[3].SeverityDirectory[3][0]);
} else {
  setSeverityDirectoryLow(response.data[3].SeverityDirectory[3].length);
}



//-------------------------------------------------------------------------------
if (response.data[5].SeveritySecure[0][0] === 0) {
  setSeveritySecureCritical(response.data[5].SeveritySecure[0][0]);
} else {
  setSeveritySecureCritical(response.data[5].SeveritySecure[0].length);
}

if (response.data[5].SeveritySecure[1][0] === 0) {
  setSeveritySecureHigh(response.data[5].SeveritySecure[1][0]);
} else {
  setSeveritySecureHigh(response.data[5].SeveritySecure[1].length);
}

if (response.data[5].SeveritySecure[2][0] === 0) {
  setSeveritySecureMedium(response.data[5].SeveritySecure[2][0]);
} else {
  setSeveritySecureMedium(response.data[5].SeveritySecure[2].length);
}

if (response.data[5].SeveritySecure[3][0] === 0) {
  setSeveritySecureLow(response.data[5].SeveritySecure[3][0]);
} else {
  setSeveritySecureLow(response.data[5].SeveritySecure[3].length);
}


//-------------------------------------------------------------------------------
if (response.data[6].SeverityHttponly[0][0] === 0) {
  setSeverityHttponlyCritical(response.data[6].SeverityHttponly[0][0]);
} else {
  setSeverityHttponlyCritical(response.data[6].SeverityHttponly[0].length);
}

if (response.data[6].SeverityHttponly[1][0] === 0) {
  setSeverityHttponlyHigh(response.data[6].SeverityHttponly[1][0]);
} else {
  setSeverityHttponlyHigh(response.data[6].SeverityHttponly[1].length);
}

if (response.data[6].SeverityHttponly[2][0] === 0) {
  setSeverityHttponlyMedium(response.data[6].SeverityHttponly[2][0]);
} else {
  setSeverityHttponlyMedium(response.data[6].SeverityHttponly[2].length);
}

if (response.data[6].SeverityHttponly[3][0] === 0) {
  setSeverityHttponlyLow(response.data[6].SeverityHttponly[3][0]);
} else {
  setSeverityHttponlyLow(response.data[6].SeverityHttponly[3].length);
}

  
        const subCategories = ["Critical", "High", "Medium", "Low"];
        const data = datanumber.flatMap((category, index) =>
          subCategories.map((subCategory) => ({
            name: `${category.name} (${subCategory}) `,
            mainCategory: category.name,
            subCategory: subCategory,
            value: category.c.find((item) => item.name === subCategory)?.c || 0,
            isMainCategory: index === 0,
          }))
        );
        setData(data)
      






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


    fetchData();
  }, 

  [project_name_id, token
      ,SeveritySQLCritical,SeveritySQLHigh,SeveritySQLMedium,SeveritySQLLow,
      SeverityXSSCritical,SeverityXSSHigh,SeverityXSSMedium,SeverityXSSLow,
      SeverityDirectoryCritical,SeverityDirectoryHigh,SeverityDirectoryMedium,SeverityDirectoryLow,
      ,SeveritySecureCritical,SeveritySecureHigh,SeveritySecureMedium,SeveritySecureLow] ); 
   


          console.log(SeverityHttponlyCritical);
          console.log(SeverityHttponlyHigh);
          console.log(SeverityHttponlyMedium);
          console.log(SeverityHttponlyLow);
  const datanumber = [
    { name: "SQL Injection",
     c: [
      { name: "Critical", c: SeveritySQLCritical },
      { name: "High", c: SeveritySQLHigh },
      { name: "Medium", c:SeveritySQLMedium },
      { name: "Low", c: SeveritySQLLow },
    ]},
    { name: "Reflected Cross Site Scripting",
    c: [
      { name: "Critical", c: SeverityXSSCritical },
      { name: "High", c: SeverityXSSHigh },
      { name: "Medium", c: SeverityXSSMedium },
      { name: "Low", c: SeverityXSSLow },
    ]},
    { name: "Directory Traversal File Include",
    c: [
      { name: "Critical", c: SeverityDirectoryCritical },
      { name: "High", c: SeverityDirectoryHigh },
      { name: "Medium", c: SeverityDirectoryMedium },
      { name: "Low", c: SeverityDirectoryLow },
    ]},
    { name: "Missing HTTP Strict Transport Security Header",
    c: [
      { name: "Critical", c: 1 },
      { name: "High", c: 1 },
      { name: "Medium", c: 1 },
      { name: "Low", c: 1 },
    ]},
    { name: "Missing Secure Attribute in Cookie Header",
    c: [
      { name: "Critical", c: SeveritySecureCritical },
      { name: "High", c: SeveritySecureHigh },
      { name: "Medium", c: SeveritySecureMedium},
      { name: "Low", c: SeveritySecureLow},
    ]},
    { name: "Missing HttpOnly Attribute in Cookie Header",
    c: [
      { name: "Critical", c: SeverityHttponlyCritical },
      { name: "High", c: SeverityHttponlyCritical },
      { name: "Medium", c: SeverityHttponlyCritical },
      { name: "Low", c: SeverityHttponlyCritical },
    ]},
    // { name: "Missing Expires Attribute in Cookie Header",
    // c: [
    //   { name: "Critical", c: 1 },
    //   { name: "High", c: 8 },
    //   { name: "Medium", c: 1 },
    //   { name: "Low", c: 1 },
    // ]},
    // { name: "Missing SameSite Attribute in Cookie Header",
    // c: [
    //   { name: "Critical", c: 1 },
    //   { name: "High", c: 1 },
    //   { name: "Medium", c: 1 },
    //   { name: "Low", c: 1 },
    // ]},
    // { name: "Web Server Information Leakage through Server header",
    // c: [
    //   { name: "Critical", c: 1 },
    //   { name: "High", c: 1 },
    //   { name: "Medium", c: 1 },
    //   { name: "Low", c: 4 },
    // ]},
    // { name: "Web Application Framework Information Leakage",
    // c: [
    //   { name: "Critical", c: 1 },
    //   { name: "High", c: 0 },
    //   { name: "Medium", c: 0 },
    //   { name: "Low", c: 1 },
    // ]},
    // { name: "Sensitive File Disclosure",
    // c: [
    //   { name: "Critical", c: 1 },
    //   { name: "High", c: 4 },
    //   { name: "Medium", c: 5},
    //   { name: "Low", c: 1 },
    // ]},
    // { name: "Command Injection",
    // c: [
    //   { name: "Critical", c: 1 },
    //   { name: "High", c: 0 },
    //   { name: "Medium", c: 0 },
    //   { name: "Low", c: 1 },
    // ]},
  ];
  
  

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="30%"
          cy="50%"
          innerRadius={40}
          outerRadius={95}
          fill="#black"
          paddingAngle={2}
          startAngle={90}
          endAngle={450}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
          <Label value={`Total: 5555`} position="center" fontSize={16} fill="#333" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Dashboard;

   