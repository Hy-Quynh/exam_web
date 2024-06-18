import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY, TABLE_ITEM_PER_PAGE } from '../../../../constants/table';
import { Button, Table, TableProps, message } from 'antd';
import { documentResultAPI } from '../../../../services/document-result';
import { displayDate } from '../../../../utils/datetime';
import { EyeOutlined } from '@ant-design/icons';
import DocumentHistoryDrawer from './components/DocumentHistoryDrawer';

function DocumentHistory() {
  const [listDocument, setListDocument] = useState([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [drawerDocumentId, setDrawerDocumentId] = useState('');

  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const getListDocument = async () => {
    try {
      const res = await documentResultAPI.getDocumentResultByStudent(
        useInfo.username
      );
      if (res?.data?.success) {
        setListDocument(res?.data?.payload?.documentResult);
      }
    } catch (error) {
      message.error('Lấy lịch sử làm đề thất bại');
    }
  };

  const columns: TableProps['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên bộ đề',
      dataIndex: 'examName',
      key: 'examName',
    },
    {
      title: 'Môn học',
      dataIndex: 'disciplineName',
      key: 'disciplineName',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'proesss',
      render: (_, record, index) => (
        <div>
          {(Object.keys(record?.answer).length / record?.questionData?.length) *
            100}
          %
        </div>
      ),
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: 'totalTime',
      key: 'totalTime',
      render: (_, record: any) => {
        return <div>{record?.totalTime + 's'} </div>;
      },
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record)}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isSubmit',
      key: 'isSubmit',
      render: (_, record: any) => (
        <div>{record?.isSubmit ? 'Đã nộp' : 'Chưa nộp'}</div>
      ),
    },
    {
      title: 'Xem đáp án',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record: any) => (
        <Button
          className='bg-primary hover:bg-primary'
          type='primary'
          shape='circle'
          icon={<EyeOutlined />}
          onClick={() => {
            setVisibleDrawer(true);
            setDrawerDocumentId(record?.documentId);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    getListDocument();
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={listDocument}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {visibleDrawer ? (
        <DocumentHistoryDrawer
          open={visibleDrawer}
          handleClose={() => {
            setVisibleDrawer(false)
            setDrawerDocumentId('')
          }}
          documentId={drawerDocumentId}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default DocumentHistory;
