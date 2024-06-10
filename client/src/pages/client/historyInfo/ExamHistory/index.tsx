import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY, TABLE_ITEM_PER_PAGE } from '../../../../constants/table';
import { Button, Table, TableProps, message } from 'antd';
import { examResultAPI } from '../../../../services/exam-result';
import { displayDate } from '../../../../utils/datetime';
import { EyeOutlined } from '@ant-design/icons';
import ExamHistoryDrawer from './components/ExamHistoryDrawer';

function ExamHistory() {
  const [listExam, setListExam] = useState([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [drawerExamId, setDrawerExamId] = useState('');
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
      title: 'Ngày thực hiện',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record)}</div>,
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
            setDrawerExamId(record?.examId);
          }}
        />
      ),
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

      {visibleDrawer ? (
        <ExamHistoryDrawer
          open={visibleDrawer}
          handleClose={() => {
            setVisibleDrawer(false);
            setDrawerExamId('');
          }}
          examId={drawerExamId}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default ExamHistory;