import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Row,
  Select,
  Table,
  TableProps,
  Typography,
  message,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import ExamHistoryDrawer from './components/ExamHistoryDrawer';
import { parseJSON } from '../../../utils/handleData';
import {
  LOGIN_KEY,
  TABLE_ITEM_PER_PAGE,
  YEAR_OPTION,
} from '../../../constants/table';
import { examResultAPI } from '../../../services/exam-result';
import { displayDate } from '../../../utils/datetime';
import { LOGIN_TYPE } from '../../../enums';
import { CSVLink } from 'react-csv';
import { disciplineAPI } from '../../../services/disciplines';

function ExamHistory() {
  const [listExam, setListExam] = useState([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [drawerExamId, setDrawerExamId] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [disciplineList, setDisciplineList] = useState<any>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [currentYear, setCurrentyear] = useState<string>(YEAR_OPTION[0].key);

  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const getDisciplineList = async () => {
    try {
      const res = await disciplineAPI.getAllDiscipline(
        undefined,
        undefined,
        '',
        undefined,
        true
      );

      if (res?.data?.success) {
        const discipline = res?.data?.payload?.discipline;
        setDisciplineList(discipline);
        if (discipline?.length) {
          setCurrentDiscipline(discipline?.[0]?._id);
          return discipline?.[0]?._id
        }
      }
      return ''
    } catch (error) {
      console.log('get discipline list error >>> ', error);
      return ''
    }
  };

  const getListExam = async (discipline: string, year: string) => {
    try {
      const res = await examResultAPI.getExamResultByStudent(
        undefined,
        undefined,
        undefined,
        discipline,
        useInfo.type === LOGIN_TYPE.TEACHER && useInfo.username
          ? useInfo.username
          : undefined,
        undefined,
        year
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
        return (
          <div>{Number(record?.testTime * 60) - record?.totalTime + 's'} </div>
        );
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
    (async () => {
      const discipline = await getDisciplineList();
      getListExam(discipline, currentYear);
    })();
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

      <Row wrap={true} justify={'start'} className='mb-[10px] mt-[10px]'>
        <div className='flex flex-start items-center gap-[16px] w-[100%] flex-wrap'>
          <div className='flex items-center'>
            <Typography.Paragraph className='text-sm mt-[10px] mr-[5px]'>
              Môn học:{' '}
            </Typography.Paragraph>
            <Select
              style={{ width: 200 }}
              options={disciplineList?.map((item: any) => {
                return {
                  value: item?._id,
                  label: item?.name,
                };
              })}
              value={currentDiscipline}
              onChange={async (value) => {
                setCurrentDiscipline(value);
                await getListExam(value, currentYear);
              }}
            />
          </div>

          <div className='flex items-center gap-[8px]'>
            <Typography.Paragraph className='text-sm mt-[10px]'>
              Năm học:{' '}
            </Typography.Paragraph>
            <Select
              style={{ width: 200 }}
              options={YEAR_OPTION?.map((item: any) => {
                return {
                  value: item?.key,
                  label: item?.label,
                };
              })}
              value={currentYear}
              onChange={async (value) => {
                setCurrentyear(value);
                await getListExam(currentDiscipline, value);
              }}
            />
          </div>
        </div>
      </Row>

      <div className='flex justify-end mb-[20px]'>
        <CSVLink
          data={listExam?.map((item: any) => {
            return {
              'Tên bài thi': item?.examKitName,
              'Môn học': item?.disciplineName,
              'Tên học sinh': item?.studentName,
              'Mã học sinh': item?.studentCode,
              'Thời gian thực hiện':
                Number(item?.testTime * 60) - item?.totalTime + 's',
              'Điểm số': item?.score,
              'Ngày thực hiện': displayDate(item?.createdAt),
            };
          })}
          filename='Danh_sach_lam_bai_thi'
          className='bg-primary text-white px-[15px] py-[5px] hover:text-white rounded-[6px]'
        >
          Xuất CSV
        </CSVLink>
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
