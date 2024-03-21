import { Col, Divider, Row, Space, Tag } from 'antd';
import SideList from '../../../components/sideList/BasicSideList';
import SideListInfo from '../../../components/sideList/SideListInfo';
import React from 'react';
import { ArrowDownOutlined, EyeOutlined } from '@ant-design/icons';

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
  titleTag: <Tag color="success">Đã tải</Tag>,
  action: [
    <IconText
      icon={ArrowDownOutlined}
      text='156'
      key='list-vertical-star-o'
    />,
    <IconText
      icon={EyeOutlined}
      text='156'
      key='list-vertical-like-o'
    />,
  ]
}));

const examDocument = Array.from({ length: 23 }).map((_, i) => ({
  href: '/',
  title: `ĐỀ THI MÔN GIẢI TÍCH B${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: 'Giáo viên đăng tải: ......',
  content:
    'Đề thi bao gồm câu hỏi về We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  extraTitleDesc: <div>
    <div>
      <p className='text-lg'>Thời lượng làm bài: 20p</p>
      <p className='text-lg'>Số câu hỏi: 20/20</p>
    </div>
  </div>,
  titleTag: <Tag color="warning">Tiến độ: 10 / 20</Tag>
}));

const HomePage: React.FC = () => {
  return (
    <div>
      <div className='mb-[50px]'>
        <Divider orientation='left'>
          <p className='text-primary text-4xl'>TÀI LIỆU MÔN HỌC</p>
        </Divider>
      </div>
      <Row wrap={true}>
        <Col md={7} span={24}>
          <SideList headerColor='bg-purple' headerText='TÀI LIỆU' />
        </Col>
        <Col md={1} />
        <Col md={16} span={24} className='mt-[30px] md:mt-0'>
          <div className='rounded-lg border-[2px] border-[#D9D9D9] border-solid p-[10px]'>
            <SideListInfo dataList={lessonDocument}/>
          </div>
        </Col>
      </Row>

      <div className='mb-[50px] mt-[100px]'>
        <Divider orientation='center'>
          <p className='text-primary text-4xl'>ĐỀ THI</p>
        </Divider>
      </div>
      <Row wrap={true}>
        <Col md={7} span={24}>
          <SideList headerColor='bg-purple' headerText='ĐỀ THI' />
        </Col>
        <Col md={1} />
        <Col md={16} span={24} className='mt-[30px] md:mt-0'>
          <div className='rounded-lg border-[2px] border-[#D9D9D9] border-solid p-[10px]'>
            <SideListInfo dataList={examDocument}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
