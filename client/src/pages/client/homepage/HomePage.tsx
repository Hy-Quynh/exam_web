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

const HomePage: React.FC = () => {
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [currentDocument, setCurrentDocument] = useState<string>('');
  const [examList, setExamList] = useState<any>([]);
  const [examKitList, setExamKitList] = useState<ExamKitType[]>([]);
  const navigate = useNavigate();

  const getDisciplineList = async () => {
    try {
      const res = await disciplineAPI.getAllDiscipline();

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
      const res = await examKitAPI.getAllExamKit(12, 0, '', discipline);
      if (res?.data?.success) {
        setExamKitList(res?.data?.payload?.examKit);
      }
    } catch (error) {
      console.log('get exam error >> ', error);
    }
  };

  const getExamData = async (discipline: string) => {
    try {
      const res = await examAPI.getAllExam(12, 0, '', discipline);
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
      <div className='mb-[50px]'>
        <Divider orientation='left'>
          <p className='text-primary text-2xl'>TÀI LIỆU MÔN HỌC</p>
        </Divider>
      </div>
      
      <Row wrap={true}>
        <Col md={7} span={24}>
          <SideList
            headerColor='bg-purple'
            headerText='ĐỀ THI'
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
                      <div>
                        <p className='text-base'>
                          Số câu hỏi: {item?.questionData?.length}
                        </p>
                      </div>
                    </div>
                  ),
                  titleTag: <Tag color='warning'>Tiến độ: Đang cập nhật</Tag>,
                  content: item?.description,
                  description: 'Giáo viên đăng tải: ......',
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
            headerText='ĐỀ THI'
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
                        <p className='text-base'>
                          Thời lượng làm bài: {item?.testTime}p
                        </p>
                        <p className='text-base'>
                          Số câu hỏi: {item?.totalQuestion}
                        </p>
                      </div>
                    </div>
                  ),
                  titleTag: <Tag color='warning'>Tiến độ: Đang cập nhật</Tag>,
                  content: item?.description,
                  description: 'Giáo viên đăng tải: ......',
                  title: item?.name,
                  createdAt: displayDate(item?.createdAt),
                  href: `/exam/${item?._id}`,
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
    </div>
  );
};

export default HomePage;
