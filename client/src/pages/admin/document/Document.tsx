import React from 'react';
import { Breadcrumb } from 'antd';


const AdminDocument: React.FC = () => {
  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Admin',
            },
            {
              title: 'bộ đề',
            },
          ]}
        />
      </div>
      <div style={{textAlign: 'center'}}>Tính năng đang được phát triển</div>
      {/* <div className='flex justify-end mb-[20px]'>
        <Button type='primary' className='bg-primary'>
          Thêm mới
        </Button>
      </div>
      <Table columns={columns} dataSource={data} /> */}
    </div>
  );
};

export default AdminDocument;
