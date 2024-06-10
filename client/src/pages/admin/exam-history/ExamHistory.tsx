import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Table, TableProps, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import ExamHistoryDrawer from './components/ExamHistoryDrawer';
import { parseJSON } from '../../../utils/handleData';
import { LOGIN_KEY, TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import { examResultAPI } from '../../../services/exam-result';
import { displayDate } from '../../../utils/datetime';
import { LOGIN_TYPE } from '../../../enums';

function ExamHistory() {
  const [listExam, setListExam] = useState([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [drawerExamId, setDrawerExamId] = useState('');
  const [studentCode, setStudentCode] = useState('');

  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const getListExam = async () => {
    try {
      const res = await examResultAPI.getExamResultByStudent(
        undefined,
        undefined,
        undefined,
        undefined,
        useInfo.type === LOGIN_TYPE.TEACHER && useInfo.username
          ? useInfo.username
          : undefined
      );

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
      title: 'Tên bài thi',
      dataIndex: 'examKitName',
      key: 'examKitName',
    },
    {
      title: 'Môn học',
      dataIndex: 'disciplineName',
      key: 'disciplineName',
    },
    {
      title: 'Tên học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Mã học sinh',
      dataIndex: 'studentCode',
      key: 'studentCode',
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
            setStudentCode(record?.studentCode);
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
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Admin',
            },
            {
              title: 'Danh sách nộp bài thi',
            },
          ]}
        />
      </div>

      <div className='flex justify-end mb-[20px]'>
        <Button
          type='primary'
          className='bg-primary'
          onClick={() => message.error('Chức năng chưa hoàn thiện')}
        >
          Xuất CSV
        </Button>
      </div>

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
          studentCode={studentCode}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default ExamHistory;
