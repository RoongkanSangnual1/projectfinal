import React, { useState } from 'react';
import { Card } from 'antd';
import './projectdash.css';
import Login from './Login';
import Navbar from './navbar';
import URLlist from './URLlists';
import { useParams } from 'react-router-dom';
const tabList = [
    {
      key: 'tab1',
      tab: 'Dashboard',
    },
    {
      key: 'tab2',
      tab: 'Issues',
    },
    {
        key: 'tab3',
        tab: 'Scan URLs',
    },
  ];
const contentList = {
tab1: <p>content1</p>,
tab2: <p>content2</p>,
tab3: <URLlist />
};
  

    
    
    
const ProjectDash = () => {
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const project_name_id = useParams()
    console.log(project_name_id)

    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };

  return (
    <div className='ProjectDash'>
        <Navbar />
    <div className="ProjectDashLayout">
      <Card
        style={{
          width: '100%',
        }}
        title={`${project_name_id.project_name}`}
        
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>

    </div>
    </div>
    );
};
export default ProjectDash;
