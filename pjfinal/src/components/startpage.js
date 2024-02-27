import React from 'react';
import Navbar from './navbar.js';
import { Button, Carousel } from 'antd';
import { BugFilled, SmileFilled, FileTextFilled, ClockCircleFilled } from '@ant-design/icons';
import "./startpage.css"
import { useNavigate} from "react-router-dom"
import fsp1 from "./imgsrc/rm373batch4-15.jpg"
import fsp2 from "./imgsrc/7971777_3807687.png"
import owasplogo from "./imgsrc/owasplogo.png"
import robologo from "./imgsrc/logo.png"
const Startpage = () => {

    const navigate = useNavigate()
return(
    <div>
        <Navbar />
        <div className='firstSection'>
           <Carousel autoplay autoplaySpeed={10000} className='contentStyle'>
                <div className='fs-1'>
                    <div className='fs-1-t1'>
                        <h1>Let's&nbsp;</h1>
                        <h1 className='fs-1-t1-appname'>RoboPentestGuide&nbsp;</h1>
                        <h1>secure your websites</h1>
                    </div>
                    <img className='fs-1-image' src={fsp1}></img>
                    <div className='fs-1-t2'>
                        <h2>Empower your security journey with RoboPentestGuide. Discover, fortify, and report vulnerabilities effortlessly.<br></br>Unleash your creative potential in securing web applications with confidence.</h2>
                        <div className='fs-1-t2-d'>
                            <BugFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Enhance efficiency by automating the discovery of common vulnerabilities</h3>
                        </div>
                        <div className='fs-1-t2-d'>
                            <SmileFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Simplify redundant pentesting efforts</h3>
                        </div>
                        <div className='fs-1-t2-d'>
                            <FileTextFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Collaborate on the creation of reports with colleagues</h3>
                        </div>
                        <div className='fs-1-t2-d'>
                            <ClockCircleFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Minimize the duration of testing</h3>
                        </div>    
                    </div>
                
                </div>
                <div className='fs-2'>
                <img className='fs-2-image' src={fsp2}></img>
                    <div className='fs-2-t2'>
                        <img className='fs-2-t2-d-i' src={owasplogo} />
                        <h1>Referring to OWASP Web Security Testing Guide for testing guidance</h1>
                    </div>
                </div>
                <div>
                <h3 >3</h3>
                </div>
            </Carousel>
            <Button onClick={() => navigate('/login')} className='CButton'>Get Started</Button> 
        </div>
        <div className='secondSection'>
            

        </div>
        <div className='thirdSection'>

        </div>
        
        
    </div>
)
}
export default Startpage;