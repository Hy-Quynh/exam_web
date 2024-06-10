import { Breadcrumb, Tabs, TabsProps } from 'antd';
import React, { useState } from 'react';
import DocumentHistory from './DocumentHistoty';
import ExamHistory from './ExamHistory';

function HistoryInfo() {
  const [currentTab, setCurrentTab] = useState('document-histoty');

  const items: TabsProps['items'] = [
    {
      key: 'document-histoty',
      label: 'Lịch sử ôn tập',
      children: <DocumentHistory />,
    },
    {
      key: 'exam-history',
      label: 'Lịch sử thi',
      children: <ExamHistory />,
    },
  ];

  return (
    <div>
      <div className='bg-[#DFE2EC] p-[20px] rounded-lg mb-[40px]'>
        <Breadcrumb
          items={[
            {
              title: <a href='/'>Trang chủ</a>,
            },
            {
              title: 'Trang cá nhân',
            },
          ]}
        />
      </div>
      <div>
        <Tabs
          defaultActiveKey='1'
          items={items}
          onChange={(tab) => {
            setCurrentTab(tab);
          }}
        />
      </div>
    </div>
  );
}

export default HistoryInfo;
