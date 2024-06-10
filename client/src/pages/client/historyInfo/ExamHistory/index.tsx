import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY, TABLE_ITEM_PER_PAGE } from '../../../../constants/table';
import { Table, TableProps, message } from 'antd';
import { examResultAPI } from '../../../../services/exam-result';
import { displayDate } from '../../../../utils/datetime';

function ExamHistory() {
  const [listExam, setListExam] = useState([]);
  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const getListExam = async () => {
    try {
      const res = await examResultAPI.getExamResultByStudent(useInfo.username);
      if (res?.data?.success) {
        setListExam(res?.data?.payload?.examResult);
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
      title: 'Tên đề kiểm tra',
      dataIndex: 'examKitName',
      key: 'examKitName',
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
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (_, record: any) => {
        return <div>{record?.score} </div>;
      },
    },
    {
      title: 'Ngày làm',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record)}</div>,
    },
  ];

  useEffect(() => {
    getListExam();
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={listExam}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />
    </div>
  );
}

export default ExamHistory;
