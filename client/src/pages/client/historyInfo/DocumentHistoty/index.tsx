import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY, TABLE_ITEM_PER_PAGE } from '../../../../constants/table';
import { Table, TableProps, message } from 'antd';
import { documentResultAPI } from '../../../../services/document-result';
import { displayDate } from '../../../../utils/datetime';

function DocumentHistory() {
  const [listDocument, setListDocument] = useState([]);
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
      title: 'Tên tài liệu',
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
      title: 'Ngày làm',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record)}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isSubmit',
      key: 'isSubmit',
      render: (_, record: any) => <div>{record?.isSubmit ? 'Đã nộp' : 'Chưa nộp'}</div>,
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
    </div>
  );
}

export default DocumentHistory;
