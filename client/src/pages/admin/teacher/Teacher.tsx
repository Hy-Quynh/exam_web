import React from 'react';
import { Breadcrumb, Button, Switch, Table } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';

interface DataType {
  index: string;
  teacherName: string;
  createdDate: string;
  createdBy: string;
  disciplineName: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Mã giáo viên',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Tên giáo viên',
    dataIndex: 'teacherName',
    key: 'teacherName',
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
    teacherName: 'Nguyễn Văn A'
  },
  {
    index: '2',
    disciplineName: 'Hoá học',
    createdDate: '21-03-2024',
    createdBy: 'Admin1',
    teacherName: 'Nguyễn Văn B'
  },
  {
    index: '3',
    disciplineName: 'Toán học',
    createdDate: '21-03-2024',
    createdBy: 'Admin1',
    teacherName: 'Nguyễn Văn C'
  },
  {
    index: '4',
    disciplineName: 'Bảo mật',
    createdDate: '21-03-2024',
    createdBy: 'Admin1',
    teacherName: 'Nguyễn Văn D'
  },
];

const AdminTeacher: React.FC = () => {
  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Admin',
            },
            {
              title: 'Giáo viên',
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

export default AdminTeacher;
