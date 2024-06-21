import { Button, Col, Divider, Row, Tag } from 'antd';
import SideList from '../../../components/sideList/BasicSideList';
import SideListInfo from '../../../components/sideList/SideListInfo';
import React, { useEffect, useState } from 'react';
import { disciplineAPI } from '../../../services/disciplines';
import { DisciplineType } from '../../admin/discipline/Discipline';
import { displayDate } from '../../../utils/datetime';
import { useNavigate } from 'react-router-dom';
import { ExamKitType } from '../../admin/exam-kit/ExamKit';
import { examKitAPI } from '../../../services/exam-kit';
import { examAPI } from '../../../services/exams';
import { parseJSON } from '../../../utils/handleData';
import { LOGIN_KEY } from '../../../constants/table';
import Banner from '../../../assets/imgs/banner.jpeg';

const HomePage: React.FC = () => {
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [currentDocument, setCurrentDocument] = useState<string>('');
  const [examList, setExamList] = useState<any>([]);
  const [examKitList, setExamKitList] = useState<ExamKitType[]>([]);
  const navigate = useNavigate();
  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const getDisciplineList = async () => {
    try {
      const res = await disciplineAPI.getAllDiscipline(
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );

      if (res?.data?.success) {
        const discipline = res?.data?.payload?.discipline;
        if (discipline?.length) {
          setCurrentDiscipline(res?.data?.payload?.discipline?.[0]?._id);
          setCurrentDocument(res?.data?.payload?.discipline?.[0]?._id);
        }
        setDisciplineList(discipline);
      }
    } catch (error) {
      console.log('get exam list error >>> ', error);
    }
  };

  const getExamKitData = async (discipline: string) => {
    try {
      const res = await examKitAPI.getAllExamKit(
        12,
        0,
        '',
        discipline,
        undefined,
        true
      );
      if (res?.data?.success) {
        setExamKitList(res?.data?.payload?.examKit);
      }
    } catch (error) {
      console.log('get exam error >> ', error);
    }
  };

  const getExamData = async (discipline: string) => {
    try {
      const res = await examAPI.getAllExam(
        12,
        0,
        '',
        discipline,
        undefined,
        undefined,
        undefined,
        true
      );
      if (res?.data?.success) {
        setExamList(res?.data?.payload?.exam);
      }
    } catch (error) {
      console.log('get exam error >> ', error);
    }
  };

  useEffect(() => {
    getDisciplineList();
  }, []);

  useEffect(() => {
    getExamKitData(currentDiscipline);
  }, [currentDiscipline]);

  useEffect(() => {
    getExamData(currentDocument);
  }, [currentDocument]);

  return (
    <div>
      {useInfo?.username ? (
        <>
          <div className='mb-[50px]'>
            <Divider orientation='left'>
              <p className='text-primary text-2xl'>DANH SÁCH BỘ ĐỀ</p>
            </Divider>
          </div>

          <Row wrap={true}>
            <Col md={7} span={24}>
              <SideList
                headerColor='bg-purple'
                headerText='MÔN HỌC'
                dataList={disciplineList}
                currentSelect={currentDocument}
                handleChangeSelect={(id: string) => setCurrentDocument(id)}
              />
            </Col>
            <Col md={1} />
            <Col md={16} span={24} className='mt-[30px] md:mt-0'>
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
          </Row>
          <div className='mt-[24px]'>
            <Button
              className='bg-purple text-white text-xl pb-[35px] pt-[5px] px-[40px] hover:!bg-purple hover:!text-white'
              onClick={() => navigate('/document')}
            >
              Xem thêm
            </Button>
          </div>

          <div className='mb-[50px] mt-[100px]'>
            <Divider orientation='center'>
              <p className='text-primary text-2xl'>ĐỀ THI</p>
            </Divider>
          </div>
          <Row wrap={true}>
            <Col md={7} span={24}>
              <SideList
                headerColor='bg-purple'
                headerText='MÔN HỌC'
                dataList={disciplineList}
                currentSelect={currentDiscipline}
                handleChangeSelect={(id: string) => setCurrentDiscipline(id)}
              />
            </Col>
            <Col md={1} />
            <Col md={16} span={24} className='mt-[30px] md:mt-0'>
              <div className='rounded-lg border-[2px] border-[#D9D9D9] border-solid p-[10px]'>
                <SideListInfo
                  dataList={examKitList?.map((item) => {
                    return {
                      ...item,
                      extraTitleDesc: (
                        <div>
                          <div>
                            <p className='text-base font-bold'>
                              Năm học: {item?.year}
                            </p>
                            <p className='text-base font-bold'>
                              Thời lượng làm bài: {item?.testTime}p
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
          <div className='mt-[24px]'>
            <Button
              className='bg-purple text-white text-xl pb-[35px] pt-[5px] px-[40px] hover:!bg-purple hover:!text-white'
              onClick={() => navigate('/exam')}
            >
              Xem thêm
            </Button>
          </div>
        </>
      ) : (
        <div>
          <div className='flex items-center justify-around gap-[10px]'>
            <div className='md:w-[40%] w-[60%]'>
              <p className='md:text-4xl md:font-bold md:mb-[30px] text-[#448A1E] text-base'>
                Nền tảng thi Online chuyên nghiệp
              </p>
              <p className='md:text-xl text-base'>
                Nơi đây cung cấp toàn bộ bộ đề của tất cả môn học để ôn tham và
                tham gia thi trực tuyến, kết quả sẽ được chấm sau khi vừa nộp
                bài
              </p>
            </div>
            <div className='md:w-auto w-[40%]'>
              <img src={Banner} alt='banner' />
            </div>
          </div>

          <div className='mt-[70px] mb-[100px]'>
            <Button
              className='bg-[#448A1E] text-white pb-[40px] pt-[10px] md:text-xl text-xl font-bold hover:!text-[#448A1E] hover:!border-[#448A1E]'
              onClick={() => navigate('/login')}
            >
              Khám phá ngay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
