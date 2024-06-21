import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import {
  LOGIN_KEY,
  TABLE_ITEM_PER_PAGE,
  YEAR_OPTION,
} from '../../../../constants/table';
import {
  Button,
  Row,
  Select,
  Table,
  TableProps,
  Typography,
  message,
} from 'antd';
import { examResultAPI } from '../../../../services/exam-result';
import { displayDate } from '../../../../utils/datetime';
import { EyeOutlined } from '@ant-design/icons';
import ExamHistoryDrawer from './components/ExamHistoryDrawer';
import { disciplineAPI } from '../../../../services/disciplines';
import { roundToTwo } from '../../../../utils/number';

function ExamHistory() {
  const [listExam, setListExam] = useState([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [drawerExamId, setDrawerExamId] = useState('');
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
        }
      }
    } catch (error) {
      console.log('get discipline list error >>> ', error);
    }
  };

  const getListExam = async (discipline: string, year: string) => {
    try {
      const res = await examResultAPI.getExamResultByStudent(
        useInfo.username,
        undefined,
        undefined,
        discipline,
        undefined,
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
      render: (_, record, index) => {
        const progress = (Object.keys(record?.answer).length / record?.questionData?.length) * 100
        return <div>{progress ? roundToTwo(Number(progress)) + '%' : '_'}</div>
      },
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (_, record: any) => {
        return <div>{roundToTwo(record?.score)} </div>;
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
    (async () => {
      await getDisciplineList();
      getListExam(currentDiscipline, currentYear);
    })();
  }, []);

  return (
    <div>
      <Row wrap={true} justify={'start'} className='mb-[50px]'>
        <div className='flex flex-start items-center gap-[16px] w-[100%] flex-wrap'>
          <div className='flex items-center'>
            <Typography.Paragraph className='text-base mt-[10px]'>
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
            <Typography.Paragraph className='text-base mt-[10px]'>
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
