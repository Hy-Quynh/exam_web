import { Breadcrumb, Col, Row, Select, Tag, Typography, message } from 'antd';
import SideList from '../../../components/sideList/BasicSideList';
import SideListInfo from '../../../components/sideList/SideListInfo';
import React, { useEffect, useState } from 'react';
import { disciplineAPI } from '../../../services/disciplines';
import { DisciplineType } from '../../admin/discipline/Discipline';
import { displayDate } from '../../../utils/datetime';
import { examKitAPI } from '../../../services/exam-kit';
import { ExamKitType } from '../../admin/exam-kit/ExamKit';
import { SubjectType } from '../../admin/subject/Subject';
import { subjectAPI } from '../../../services/subjects';
import { useSearchParams } from 'react-router-dom';

const ExamPage: React.FC = () => {
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [examList, setExamList] = useState<ExamKitType[]>([]);
  const [searchParams] = useSearchParams();

  const getSubjectList = async () => {
    try {
      const res = await subjectAPI.getAllSubject(
        undefined,
        undefined,
        undefined,
        true
      );

      if (res?.data?.success) {
        setSubjectList(res?.data?.payload?.subject);
      }
    } catch (error) {
      console.log('get subject list error >>> ', error);
    }
  };

  const getDisciplineList = async (subject: string) => {
    try {
      const res = await disciplineAPI.getAllDiscipline(
        undefined,
        undefined,
        undefined,
        subject,
        true
      );

      if (res?.data?.success) {
        const discipline = res?.data?.payload?.discipline;
        setDisciplineList(discipline);
      }
    } catch (error) {
      console.log('get exam list error >>> ', error);
    }
  };

  const getExamKitData = async (discipline: string, subject: string) => {
    try {
      const res = await examKitAPI.getAllExamKit(
        undefined,
        undefined,
        '',
        discipline,
        undefined,
        true,
        subject
      );
      if (res?.data?.success) {
        setExamList(res?.data?.payload?.examKit);
      }
    } catch (error) {
      console.log('get exam error >> ', error);
    }
  };

  useEffect(() => {
    getSubjectList();
  }, []);

  useEffect(() => {
    const paramSubject = searchParams.get('subject');
    const paramDiscipline = searchParams.get('discipline');

    if (paramSubject) {
      setCurrentSubject(paramSubject);
      getDisciplineList(paramSubject);
    } else {
      getDisciplineList('');
    }

    if (paramDiscipline) {
      setCurrentDiscipline(paramDiscipline);
    }

    getExamKitData(paramDiscipline || '', paramSubject || '');
  }, []);

  return (
    <div>
      <div className='bg-[#DFE2EC] p-[20px] rounded-lg mb-[40px]'>
        <Breadcrumb
          items={[
            {
              title: <a href='/'>Trang chủ</a>,
            },
            {
              title: 'Đề thi',
            },
          ]}
        />
      </div>
      <Row wrap={true} justify={'start'} className='mb-[50px]'>
        <Typography.Paragraph className='text-xl font-medium w-[40%] text-left'>
          Bộ lọc
        </Typography.Paragraph>
        <div className='flex justify-around items-center gap-[16px] w-[100%] flex-wrap'>
          <div className='flex items-center gap-[8px]'>
            <Typography.Paragraph className='text-lg mt-[10px]'>
              Bộ môn:{' '}
            </Typography.Paragraph>
            <Select
              style={{ width: 200 }}
              options={subjectList?.map((item) => {
                return {
                  value: item?._id,
                  label: item?.name,
                };
              })}
              value={currentSubject}
              onChange={async(value) => {
                setCurrentDiscipline('');
                setCurrentSubject(value);
                await getDisciplineList(value)
                getExamKitData('', value);
              }}
            />
          </div>
        </div>
      </Row>

      <Row wrap={true}>
        <Col md={7} span={24}>
          <SideList
            headerColor='bg-purple'
            headerText='MÔN HỌC'
            dataList={disciplineList}
            currentSelect={currentDiscipline}
            handleChangeSelect={(id: string) => {
              setCurrentDiscipline(id);
              getExamKitData(id, currentSubject);
            }}
          />
        </Col>
        <Col md={1} />
        <Col md={16} span={24} className='mt-[30px] md:mt-0'>
          <div className='rounded-lg border-[2px] border-[#D9D9D9] border-solid p-[10px]'>
            <SideListInfo
              dataList={examList?.map((item) => {
                return {
                  ...item,
                  extraTitleDesc: (
                    <div>
                      <div>
                        <p className='text-lg font-bold'>
                          Thời lượng làm bài: {item?.testTime}p
                        </p>
                        <p className='text-lg font-bold'>
                          Số câu hỏi: {item?.totalQuestion}
                        </p>
                      </div>
                    </div>
                  ),
                  content: item?.description,
                  title: item?.name,
                  createdAt: displayDate(item?.createdAt),
                  href: `/exam/${item?._id}`,
                  disabledBtn: !item?.openExamStatus,
                };
              })}
              dislayActionBtn={true}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ExamPage;
