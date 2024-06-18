import { Breadcrumb, Col, Row, Select, Tag, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { SubjectType } from '../../admin/subject/Subject';
import { subjectAPI } from '../../../services/subjects';
import SideListInfo from '../../../components/sideList/SideListInfo';
import { displayDate } from '../../../utils/datetime';
import { examAPI } from '../../../services/exams';
import { disciplineAPI } from '../../../services/disciplines';
import { useSearchParams } from 'react-router-dom';

function Documentpage() {
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [disciplineList, setDisciplineList] = useState<any>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [chapterList, setChapterList] = useState<any>([]);
  const [currentChapter, setCurrentChapter] = useState<string>('');
  const [examList, setExamList] = useState<any>([]);
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

  const getDisciplineList = async (subject: string, discipline: string) => {
    try {
      const res = await disciplineAPI.getAllDiscipline(
        undefined,
        undefined,
        '',
        subject,
        true
      );

      if (res?.data?.success) {
        setDisciplineList(res?.data?.payload?.discipline);

        if (discipline) {
          setChapterList(
            res?.data?.payload?.discipline?.find(
              (it: any) => it?._id === discipline
            )?.chapters
          );
        }
      }
    } catch (error) {
      console.log('get discipline list error >>> ', error);
    }
  };

  const getExamList = async (
    subject?: string,
    discipline?: string,
    chapter?: string
  ) => {
    try {
      const exam = await examAPI.getAllExam(
        undefined,
        undefined,
        '',
        discipline,
        subject,
        chapter,
        undefined,
        true
      );
      if (exam?.data?.success) {
        setExamList(exam?.data?.payload?.exam);
      }
    } catch (error) {
      message.error('Lấy thông tin bộ đề thất bại');
    }
  };

  useEffect(() => {
    getSubjectList();
  }, []);

  useEffect(() => {
    const paramSubject = searchParams.get('subject');
    const paramDiscipline = searchParams.get('discipline');
    const paramChapter = searchParams.get('chapter');

    if (paramSubject) {
      setCurrentSubject(paramSubject);
      getDisciplineList(paramSubject, paramDiscipline || '')
    }else {
      getDisciplineList('', paramDiscipline || '')
    }

    if (paramDiscipline) {
      setCurrentDiscipline(paramDiscipline);
    }

    if (paramChapter) {
      setCurrentChapter(paramChapter);
    }

    getExamList(paramSubject || '', paramDiscipline || '', paramChapter || '');
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
              title: 'Bộ đề',
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
              onChange={async (value) => {
                setCurrentDiscipline('');
                setCurrentChapter('');
                setCurrentSubject(value);
                await getDisciplineList(value, currentDiscipline)
                getExamList(value, '', '');
              }}
            />
          </div>

          <div className='flex items-center gap-[8px]'>
            <Typography.Paragraph className='text-lg mt-[10px]'>
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
              onChange={(value) => {
                setCurrentChapter('');
                setChapterList(
                  disciplineList?.find((it: any) => it?._id === value)?.chapters
                );
                setCurrentDiscipline(value);
                getExamList(currentSubject, value, '');
              }}
            />
          </div>

          <div className='flex items-center gap-[8px]'>
            <Typography.Paragraph className='text-lg mt-[10px]'>
              Chương:{' '}
            </Typography.Paragraph>
            <Select
              style={{ width: 200 }}
              options={chapterList?.map((item: any) => {
                return {
                  value: item?._id,
                  label: item?.name,
                };
              })}
              value={currentChapter}
              onChange={(value) => {
                setCurrentChapter(value);
                getExamList(currentSubject, currentDiscipline, value);
              }}
            />
          </div>
        </div>
      </Row>

      <Row wrap={true}>
        <Col md={2} span={24} />
        <Col md={18} span={24} className='mt-[30px] md:mt-0'>
          <div className='rounded-lg border-[2px] border-[#D9D9D9] border-solid p-[10px]'>
            <SideListInfo
              dataList={examList?.map((item: any) => {
                return {
                  ...item,
                  extraTitleDesc: (
                    <div>
                      <p className='text-base font-bold'>
                        Số câu hỏi: {item?.questionData?.length}
                      </p>
                    </div>
                  ),
                  content: item?.description,
                  title: item?.name,
                  createdAt: displayDate(item?.createdAt),
                  href: `/document/${item?._id}`,
                };
              })}
              dislayActionBtn={true}
            />
          </div>
        </Col>
        <Col md={2} span={24} />
      </Row>
    </div>
  );
}

export default Documentpage;
