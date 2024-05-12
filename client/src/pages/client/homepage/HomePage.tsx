import { Button, Col, Divider, Row, Space, Tag } from 'antd';
import SideList from '../../../components/sideList/BasicSideList';
import SideListInfo from '../../../components/sideList/SideListInfo';
import React, { useEffect, useState } from 'react';
import { ArrowDownOutlined, EyeOutlined } from '@ant-design/icons';
import { disciplineAPI } from '../../../services/disciplines';
import { DisciplineType } from '../../admin/discipline/Discipline';
import { displayDate } from '../../../utils/datetime';
import { useNavigate } from 'react-router-dom';
import { ExamKitType } from '../../admin/exam-kit/ExamKit';
import { examKitAPI } from '../../../services/exam-kit';

const data = [
  { name: 'Lập trình web (9)', _id: 1 },
  { name: 'Lập trình mobile (9)', _id: 2 },
  { name: 'Bảo mật (9)', _id: 3 },
  { name: 'Giải tích B1 (9)', _id: 4 },
  { name: 'Giải tích B2 (9)', _id: 5 },
];

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const lessonDocument = Array.from({ length: 23 }).map((_, i) => ({
  href: '/',
  title: `TÀI LIỆU ÔN THI MÔN GIẢI TÍCH B${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: 'Giáo viên đăng tải: ......',
  content:
    'Đề ôn luyện kiến thức về: We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  titleTag: <Tag color='success'>Đã tải</Tag>,
  action: [
    <IconText icon={ArrowDownOutlined} text='156' key='list-vertical-star-o' />,
    <IconText icon={EyeOutlined} text='156' key='list-vertical-like-o' />,
  ],
}));

const HomePage: React.FC = () => {
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [examKitList, setExamKitList] = useState<ExamKitType[]>([]);
  const navigate = useNavigate();

  const getDisciplineList = async () => {
    try {
      const res = await disciplineAPI.getAllDiscipline();

      if (res?.data?.success) {
        const discipline = res?.data?.payload?.discipline;
        if (discipline?.length) {
          setCurrentDiscipline(res?.data?.payload?.discipline?.[0]?._id);
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

  useEffect(() => {
    getDisciplineList();
  }, []);

  useEffect(() => {
    getExamKitData(currentDiscipline);
  }, [currentDiscipline]);

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
            headerText='TÀI LIỆU'
            dataList={data}
          />
        </Col>
        <Col md={1} />
        <Col md={16} span={24} className='mt-[30px] md:mt-0'>
          <div className='rounded-lg border-[2px] border-[#D9D9D9] border-solid p-[10px]'>
            <SideListInfo dataList={lessonDocument} />
          </div>
        </Col>
      </Row>

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
