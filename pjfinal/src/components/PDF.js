import {jsPDF} from 'jspdf'
import autoTable from 'jspdf-autotable'
import {Button} from 'antd';
import axios from 'axios'
import { FaRegFilePdf } from "react-icons/fa6";
import {font} from "./THSarabunNew-normal"
import {fontBold} from "./THSarabunNew_Bold-bold"
const PDF = (props) => {
  const token = localStorage.getItem('token');
  const name_id = props.id;

  console.log("responsedata", props.responsedata);

  const data = props.responsedata.filter(item => Object.values(item)[0]?.length !== 0);
  console.log("data", data);

  let body2 = [];
  function getSeverityByKey(key) {
    const severityMapping = {
      "Web Server Infomation Leakage through Server header": "Low",
      "Web Application Framework Infomation Leakage": "Medium",
      "Directory Traversal File Include": "Medium",
      "Missing Secure Attribute in Cookie Header": "Low",
      "Missing HttpOnly Attribute in Cookie Header": "Low",
      "Missing Expires Attribute in Cookie Header": "Low",
      "Missing SameSite Attribute in Cookie Header": "Low",
      "Reflected Cross Site Scripting": "High",
      "Stored Cross Site Scriptng": "High",
      "SQL Injection": "High",
      "Command Injection": "High",
      "Missing HTTP Strict Transport Security Header": "Low",
      "Sensitive File Disclosure": "High",
    
    };
  
    return severityMapping[key] || "High"; 
  }
  function CheckCurrentY(currentY){
    if (currentY > 260){
      doc.addPage()
      currentY = 15;
    }
    else{
      currentY = currentY
    }
    return currentY;
  }
  
  data.forEach((item, index) => {
    const key = Object.keys(item)[0];
    const severity = getSeverityByKey(key); 
    body2.push([`${index + 1}`, key, severity, ...Object.values(item)[0]]);
  });
  
console.log(body2)
  const doc = new jsPDF();
  doc.addFileToVFS("MyFont.ttf", font);
  doc.addFileToVFS("MyFontBold.ttf", fontBold);
  doc.addFont("MyFont.ttf", "MyFont", "normal");
  doc.addFont("MyFontBold.ttf", "MyFont", "bold");
  

  const showModal = () => {
    doc.setFontSize(20);
    doc.setTextColor("blue");
    doc.setFont("MyFont","bold");
    doc.text(`Penetration Testing Report of ${props.name}`, 14, 10);
    doc.setFontSize(16);

    doc.text(`Vulnerability Targets`, 14, 17);

    let content = {
      startY: 20,
      head: [['Target Site', 'Details']],
      body: [[` ${props.url_target}`, ` ${props.Details}`]]
      // theme: 'grid'
    };
    let content1 ={
      startY: 30

    }

    let content2 = {
      startY: 45,
      head: [['ID', 'Vulnerability Details', 'Severity']],
      body: body2,
    };

    doc.autoTable(content);

    doc.setFontSize(16);
    doc.text(`Vulnerability Issues`, 14, 42);
    doc.autoTable(content2);


    // doc.save(`Penetration Testing ${props.name}`);

data.forEach((item, index) => {
  const key = Object.keys(item)[0];
  const vulnerabilities = Object.values(item)[0];
  console.log("vulnerabilities", vulnerabilities);

  doc.addPage();

  doc.setFontSize(16);
  doc.setFont("MyFont","bold");
  doc.setTextColor("blue");
  doc.text(`${key}`, 14, 15);
  doc.setFont("MyFont","normal");
  doc.setTextColor("black");
  let vulcontenthead = [['ID', 'URL', 'Parameters','Severity']];
  let columnStyles_vulcontent;
  let columnStyles_vulcontent_1 = {
    0: {
      cellWidth: 20,
    },
    1: {
      cellWidth: 100,
    },
    2: {
      cellWidth: 40,
    },
    3: {
      cellWidth: 20
    }
  };
  let columnStyles_vulcontent_2 = {
    0: {
      cellWidth: 20,
    },
    1: {
      cellWidth: 100,
    },
    2: {
      cellWidth: 60,
    },
  };
  let vulcontentbody = vulnerabilities.map((vulnerability, innerIndex) => {
      let url, evidence,severity;
      /* เดี๋ยวแก้เป็นพารามิเตอร์ */
      if (key === "SQL Injection" || key === "Directory Traversal File Include") {
        vulcontenthead = [['ID', 'URL','Parameters','severity']];
        url = vulnerability[4];
        evidence = vulnerability[5];
        severity = vulnerability[12];
        columnStyles_vulcontent = columnStyles_vulcontent_1;
        return [`${innerIndex + 1}`, url, evidence,severity];
      }else if(key === "Reflected Cross Site Scripting"){
        vulcontenthead = [['ID', 'URL','Parameters','severity']];
        url = vulnerability[6];
        evidence = vulnerability[2];
        severity = vulnerability[12];
        columnStyles_vulcontent = columnStyles_vulcontent_1;
        return [`${innerIndex + 1}`, url, evidence,severity];
      }else if(key === "Sensitive File Disclosure"){
        vulcontenthead = [['ID', 'URL','severity']];
        url = vulnerability[3];
        severity = vulnerability[12];
        columnStyles_vulcontent = columnStyles_vulcontent_2;
        return [`${innerIndex + 1}`, url,severity];
      } else {
        vulcontenthead = [['ID', 'URL','severity']];
        url = vulnerability[2];
        // evidence = vulnerability[3];
        severity = vulnerability[12];
        columnStyles_vulcontent = columnStyles_vulcontent_2;
        return [`${innerIndex + 1}`, url,severity];
      }

      
    });
  
  let vulcontent = {
    startY: 20,
    head: vulcontenthead,
    body: vulcontentbody,
    columnStyles: columnStyles_vulcontent
  };
  /* create summary table of each vulnerability */
  doc.autoTable(vulcontent);
    doc.setFontSize(16);
    let details, Evidence,Solutions,owasp,reference;

      if (key === "SQL Injection" || key === "Directory Traversal File Include" || key === "Reflected Cross Site Scriptng") {
        details = vulnerabilities[0][7];
        Evidence = vulnerabilities[0][6];
        Solutions= vulnerabilities[0][8];
        owasp= vulnerabilities[0][9];
        reference = vulnerabilities[0][11];
      
      }else if (key === "Sensitive File Disclosure") {
        details = vulnerabilities[0][7];
        Evidence = vulnerabilities[0][6];
        Solutions= vulnerabilities[0][8];
        owasp= vulnerabilities[0][9];
        reference = vulnerabilities[0][11];
      
      } else {
        details = vulnerabilities[0][4];
        Evidence = vulnerabilities[0][3];
        Solutions= vulnerabilities[0][5];
        owasp= vulnerabilities[0][6];
        reference = vulnerabilities[0][11];
      }
    doc.setFontSize(12);

    // แยกข้อความและเก็บไว้ในอาร์เรย์
    const detailsLines = doc.splitTextToSize(`Vulnerability description \n${details}`, 180);
    const evidenceLines = doc.splitTextToSize(`Evidence \n${Evidence}`, 180);
    const solutionsLines = doc.splitTextToSize(`Solutions \n${Solutions}`, 180);
    const wstgLines = doc.splitTextToSize(`WSTG-ID \n${owasp}`, 180);
    const referenceLines = doc.splitTextToSize(`References \n${reference}`, 180);
    console.log("detailsLines",detailsLines)
    
    // แสดงแต่ละบรรทัด
    // let offsetY = 15;
    let currentY = doc.autoTable.previous.finalY;
    currentY += 25
    
    detailsLines.forEach((line, index) => {
      console.log(line)
      if (index === 0){
        doc.setFont("MyFont","bold");
        doc.setFontSize(16)
        currentY += 10
      }else{
        doc.setFont("MyFont","normal");
        doc.setFontSize(12)
        currentY += 5
      }
      
      doc.text(line, 14, currentY);
      currentY = CheckCurrentY(currentY)
      console.log(line)
      
      // console.log(doc.autoTable.previous.finalY + 10 + index * 10)
    });

    evidenceLines.forEach((line, index) => {
      if (index === 0){
        doc.setFont("MyFont","bold");
        doc.setFontSize(16)
        currentY += 10
      }else{
        doc.setFont("MyFont","normal");
        doc.setFontSize(12)
        currentY += 5
      }
      
      doc.text(line, 14, currentY);
      currentY = CheckCurrentY(currentY)
      // console.log(line)
    });
    console.log(solutionsLines)
    solutionsLines.forEach((line, index) => {
      if (index === 0){
        doc.setFont("MyFont","bold");
        doc.setFontSize(16)
        currentY += 10
      }else{
        doc.setFont("MyFont","normal");
        doc.setFontSize(12)
        currentY += 5
      }

      doc.text(line, 14, currentY);
      currentY = CheckCurrentY(currentY)
    });
    
    wstgLines.forEach((line, index) => {
      if (index === 0){
        doc.setFont("MyFont","bold");
        doc.setFontSize(16)
        currentY += 10
      }else{
        doc.setFont("MyFont","normal");
        doc.setFontSize(12)
        currentY += 5
      }

      doc.text(line, 14, currentY);
      currentY = CheckCurrentY(currentY)
    });
    referenceLines.forEach((line, index) => {
      if (index === 0){
        doc.setFont("MyFont","bold");
        doc.setFontSize(16)
        currentY += 10
      }else{
        doc.setFont("MyFont","normal");
        doc.setFontSize(12)
        currentY += 5
      }
      doc.text(line, 14, currentY);
      currentY = CheckCurrentY(currentY)
    });
    console.log('currentY: ' +currentY)
    






});

      doc.save(`Penetration Testing ${props.name}`);
  };

  return (
    <div>
      <Button
        icon={<FaRegFilePdf />}
        onClick={showModal}
        type="primary"
        style={{ transform: 'translateX(850px) scale(1.5)', marginTop: '20px', background: 'red' }}
      >
        PDF
      </Button>
    </div>
  );
};

export default PDF;