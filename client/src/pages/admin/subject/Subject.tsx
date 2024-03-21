import React from 'react';
import { Breadcrumb, Button, Switch, Table } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';

interface DataType {
  index: string;
  subjectName: string;
  createdDate: string;
  createdBy: string;
  disciplineName: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Mã môn học',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Tên môn học',
    dataIndex: 'subjectName',
    key: 'subjectName',
  },
  {
    title: 'Bộ môn',
    dataIndex: 'disciplineName',
    key: 'disciplineName',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'Người tạo',
    dataIndex: 'createdBy',
    key: 'createdBy',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => <Switch checked={true}/>
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => <TableAction key={record?.index}/>,
  },
];

const data: DataType[] = [
  {
    index: '1',
    disciplineName: 'Khoa học máy tính',
    createdDate: '21-03-2024',
    createdBy: 'Admin1',
    subjectName: 'Thống kê dữ liệu'
  },
  {
    index: '2',
    disciplineName: 'Hoá học',
    createdDate: '21-03-2024',
    createdBy: 'Admin1',
    subjectName: 'Hoá học 1'
  },
  {
    index: '3',
    disciplineName: 'Toán học',
    createdDate: '21-03-2024',
    createdBy: 'Admin1',
    subjectName: 'Giải tích 1'
  },
  {
    index: '4',
    disciplineName: 'Bảo mật',
    createdDate: '21-03-2024',
    createdBy: 'Admin1',
    subjectName: 'Bảo mật web'
  },
];

const AdminSubject: React.FC = () => {
  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Admin',
            },
            {
              title: 'Môn học',
            },
          ]}
        />
      </div>
      <div className='flex justify-end mb-[20px]'>
        <Button type='primary' className='bg-primary'>
          Thêm mới
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default AdminSubject;
