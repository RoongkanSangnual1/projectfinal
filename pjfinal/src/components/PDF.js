import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from 'antd';
import axios from 'axios'
import { FaRegFilePdf } from "react-icons/fa6";
import { font } from "./THSarabunNew-normal"
import { fontBold } from "./THSarabunNew_Bold-bold"
const PDF = (props) => {
  const token = localStorage.getItem('token');
  const name_id = props.id;
  console.log(props)
  // console.log("newResData:", responsedata2);
  // console.log("oldResData:", responsedata);
  const data = props.responsedata.filter(item => Object.values(item)[0]?.length !== 0);
  console.log("DATAAAA", data);
  let datalength = data.length;
  

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
  function CheckCurrentY(currentY) {
    if (currentY > 260) {
      doc.addPage()
      currentY = 15;
    }
    else {
      currentY = currentY
    }
    return currentY;
  }

  data.forEach((item, index) => {
    const key = Object.keys(item)[0];
    const severity = getSeverityByKey(key);
    console.log("key", key);
    console.log("severity", severity);
    body2.push([`${index + 1}`, key, severity, ...Object.values(item)[0]]);
    }
    );
  // owaspfounddata.forEach((item, index) => {
  //   const key = item[0];
  //   const severity = getSeverityByKey(key); 
  //   console.log("key",key);
  //   console.log("severity",severity);
  //   body2.push([`${index + 1}`, key, severity, ...item.slice(1)]);
  // });

  console.log("body2", body2)
  const doc = new jsPDF({
    format: 'a4' // Specify A4 size
  });
  doc.addFileToVFS("MyFont.ttf", font);
  doc.addFileToVFS("MyFontBold.ttf", fontBold);
  doc.addFont("MyFont.ttf", "MyFont", "normal");
  doc.addFont("MyFontBold.ttf", "MyFont", "bold");


  const showModal = () => {
    doc.setFontSize(20);
    doc.setTextColor("blue");
    doc.setFont("MyFont", "bold");
    //25.4mm = 1 inch 
    let startY = 25.4;
    doc.text(`Penetration Testing Report of ${props.name}`, 25.4, startY);
    doc.setFontSize(16);
    startY += 7;
    doc.text(`Vulnerability Targets`, 25.4, startY);

    let content = {
      startY: 35.4,
      head: [['Target Site', 'Details']],
      body: [[` ${props.url_target}`, ` ${props.Details}`]],
      margin: { left: 25.4 },
      columnStyles: {
        0: {
          cellWidth: 70,
        },
        1: {
          cellWidth: 89,
        }
      }
      // theme: 'grid'
    };
    let content1 = {
      startY: 30

    }

    let content2 = {
      startY: 60.4,
      head: [['No.', 'Vulnerability Details', 'Severity']],
      body: body2,
      margin: { left: 25.4 },
      columnStyles: {
        0: {
          cellWidth: 20,
        },
        1: {
          cellWidth: 119,
        },
        2: {
          cellWidth: 20,
        }
      }
    };

    doc.autoTable(content);
//32.4
    startY += 25
    doc.setFontSize(16);
    doc.text(`Vulnerability Issues`, 25.4, startY);
    doc.autoTable(content2);
    const maxWidth = doc.internal.pageSize.getWidth();
    const maxHeight = doc.internal.pageSize.getHeight();

    console.log("Max Width:", maxWidth, "points");
    console.log("Max Height:", maxHeight, "points");

    // doc.save(`Penetration Testing ${props.name}`);

    data.forEach((item, index) => {
      const key = Object.keys(item)[0];
      
      console.log('KEY',key)
      let vulnerabilities;
      vulnerabilities = Object.values(item)[0];
      console.log('vulnerabilities',vulnerabilities)
      if (vulnerabilities && Array.isArray(vulnerabilities)) {
        console.log("vulnerabilities", vulnerabilities);

        // console.log("vulnerabilities", vulnerabilities);

        doc.addPage();

        doc.setFontSize(16);
        doc.setFont("MyFont", "bold");
        doc.setTextColor("blue");
        doc.text(`${index+1}. ${key}`, 25.4, 25.4);
        doc.setFont("MyFont", "normal");
        doc.setTextColor("black");
        let vulcontenthead = [['No.', 'URL', 'Parameter', 'Severity']];
        
        let columnStyles_vulcontent_1 = {
          //159.2
          0: {
            cellWidth: 20,
          },
          1: {
            cellWidth: 79,
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
            cellWidth: 79,
          },
          2: {
            cellWidth: 60,
          },
        };
        let columnStyles_vulcontent_3 = {
          //159.2
          0: {
            cellWidth: 20,
          },
          1: {
            cellWidth: 69,
          },
          2: {
            cellWidth: 30,
          },
          3: {
            cellWidth: 20,
          },
          4: {
            cellWidth: 20
          },

        };

        let columnStyles_vulcontent = columnStyles_vulcontent_2;
        let vulcontentbody = vulnerabilities.map((vulnerability, innerIndex) => {
          let url, evidence, parameter, payload, severity;
          /* เดี๋ยวแก้เป็นพารามิเตอร์ */
          if (key === "SQL Injection" ) {
            vulcontenthead = [['No.', 'URL', 'Parameter','Payload', 'Severity']];
            url = vulnerability[1];
            parameter = vulnerability[7];
            payload = vulnerability[3]
            severity = vulnerability[13];
            columnStyles_vulcontent = columnStyles_vulcontent_3;
            return [`${innerIndex + 1}`, url, parameter, payload, severity];
          }else if ( key === "Directory Traversal File Include") {
            vulcontenthead = [['No.', 'URL', 'Parameters', 'severity']];
            url = vulnerability[4];
            evidence = vulnerability[5];
            severity = vulnerability[12];
            columnStyles_vulcontent = columnStyles_vulcontent_1;
            return [`${innerIndex + 1}`, url, evidence, severity];
          }
           else if (key === "Reflected Cross Site Scripting") {
            vulcontenthead = [['No.', 'URL', 'Parameters', 'severity']];
            url = vulnerability[1];
            evidence = vulnerability[3];
            severity = vulnerability[12];
            columnStyles_vulcontent = columnStyles_vulcontent_1;
            return [`${innerIndex + 1}`, url, evidence, severity];
          }
          else if (key === "Sensitive File Disclosure") {
            vulcontenthead = [['No.', 'URL', 'severity']];
            url = vulnerability[2];
            severity = vulnerability[12];
            columnStyles_vulcontent = columnStyles_vulcontent_2;
            return [`${innerIndex + 1}`, url, severity];
          }
          // else if(key == "owasp_"){
          //   return null;
          // } 
          else {
            vulcontenthead = [['No.', 'URL', 'severity']];
            url = vulnerability[2];
            // evidence = vulnerability[3];
            severity = vulnerability[10];
            columnStyles_vulcontent = columnStyles_vulcontent_2;
            return [`${innerIndex + 1}`, url, severity];
          }


        });
        // vulcontentbody = vulcontentbody.filter(entry => entry !== null);
        let vulcontent = {
          startY: 30.4,
          head: vulcontenthead,
          body: vulcontentbody,
          margin: { left: 25.4 },
          columnStyles: columnStyles_vulcontent
        };
        /* create summary table of each vulnerability */
        doc.autoTable(vulcontent);
        doc.setFontSize(16);
        let details, Evidence, Solutions, owasp, reference;

        if (key === "SQL Injection" ) {
          details = vulnerabilities[0][8];
          Evidence = "From the table above, when injecting the payload into the parameter, it receives an unexpected response."
          Solutions = vulnerabilities[0][9];
          owasp = vulnerabilities[0][10];
          reference = vulnerabilities[0][12];

        }else if (key === "Directory Traversal File Include" ) {
          details = vulnerabilities[0][7];
          Evidence = "From the table above, when injecting the payload into the parameter, it receives an unexpected response.";
          Solutions = vulnerabilities[0][8];
          owasp = vulnerabilities[0][9];
          reference = vulnerabilities[0][11];

        }
         else if (key === "Reflected Cross Site Scripting") {
          details = vulnerabilities[0][7];
          Evidence = "From the table above, when injecting the payload into the parameter, it receives an unexpected response.";
          Solutions = vulnerabilities[0][8];
          owasp = vulnerabilities[0][9];
          reference = vulnerabilities[0][11];

        } else if (key === "Sensitive File Disclosure") {
          details = vulnerabilities[0][7];
          Evidence = "We have found sensitive file from following URLs";
          Solutions = vulnerabilities[0][8];
          owasp = vulnerabilities[0][9];
          reference = vulnerabilities[0][11];

        } else {
          details = vulnerabilities[0][4];
          Evidence = vulnerabilities[0][3];
          Solutions = vulnerabilities[0][5];
          owasp = vulnerabilities[0][6];
          reference = vulnerabilities[0][11];
        }
        doc.setFontSize(12);

        // แยกข้อความและเก็บไว้ในอาร์เรย์
        const detailsLines = doc.splitTextToSize(`Vulnerability description \n${details}`, 159.2);
        const evidenceLines = doc.splitTextToSize(`Evidence \n${Evidence}`, 159.2);
        const solutionsLines = doc.splitTextToSize(`Solutions \n${Solutions}`, 159.2);
        const wstgLines = doc.splitTextToSize(`WSTG-ID \n${owasp}`, 159.2);
        const referenceLines = doc.splitTextToSize(`References \n${reference}`, 159.2);
        console.log("detailsLines", detailsLines)

        // แสดงแต่ละบรรทัด
        // let offsetY = 15;
        let currentY = doc.autoTable.previous.finalY;
        currentY += 10

        detailsLines.forEach((line, index) => {
          console.log(line)
          if (index === 0) {
            doc.setFont("MyFont", "bold");
            doc.setFontSize(16)
            currentY += 10
          } else {
            doc.setFont("MyFont", "normal");
            doc.setFontSize(12)
            currentY += 5
          }

          doc.text(line, 25.4, currentY);
          currentY = CheckCurrentY(currentY)
          console.log(line)

          // console.log(doc.autoTable.previous.finalY + 10 + index * 10)
        });

        evidenceLines.forEach((line, index) => {
          if (index === 0) {
            doc.setFont("MyFont", "bold");
            doc.setFontSize(16)
            currentY += 10
          } else {
            doc.setFont("MyFont", "normal");
            doc.setFontSize(12)
            currentY += 5
          }

          doc.text(line, 25.4, currentY);
          currentY = CheckCurrentY(currentY)
          // console.log(line)
        });
        console.log(solutionsLines)
        solutionsLines.forEach((line, index) => {
          if (index === 0) {
            doc.setFont("MyFont", "bold");
            doc.setFontSize(16)
            currentY += 10
          } else {
            doc.setFont("MyFont", "normal");
            doc.setFontSize(12)
            currentY += 5
          }

          doc.text(line,25.4, currentY);
          currentY = CheckCurrentY(currentY)
        });

        wstgLines.forEach((line, index) => {
          if (index === 0) {
            doc.setFont("MyFont", "bold");
            doc.setFontSize(16)
            currentY += 10
          } else {
            doc.setFont("MyFont", "normal");
            doc.setFontSize(12)
            currentY += 5
          }

          doc.text(line, 25.4, currentY);
          currentY = CheckCurrentY(currentY)
        });
        referenceLines.forEach((line, index) => {
          if (index === 0) {
            doc.setFont("MyFont", "bold");
            doc.setFontSize(16)
            currentY += 10
          } else {
            doc.setFont("MyFont", "normal");
            doc.setFontSize(12)
            currentY += 5
          }
          doc.text(line, 25.4, currentY);
          currentY = CheckCurrentY(currentY)
        });
        console.log('currentY: ' + currentY)




      } else {
        console.warn(`Vulnerabilities for key '${key}' is not defined or not an array.`);
      }


    });

    doc.save(`Penetration Testing ${props.name}`);
  };

  return (
    <div>
      <Button 
        type="primary"
        shape="round" 
        onClick={showModal}
        icon={<FaRegFilePdf />}
      >
        Export as PDF
      </Button>

    </div>
  );
};

export default PDF;