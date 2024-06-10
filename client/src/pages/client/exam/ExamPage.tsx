import { Breadcrumb, Col, Row, Select, Tag, Typography, message } from 'antd';
import SideList from '../../../components/sideList/BasicSideList';
import SideListInfo from '../../../components/sideList/SideListInfo';
import React, { useEffect, useState } from 'react';
import { disciplineAPI } from '../../../services/disciplines';
import { DisciplineType } from '../../admin/discipline/Discipline';
import { displayDate } from '../../../utils/datetime';
import { examKitAPI } from '../../../services/exam-kit';
import { ExamKitType } from '../../admin/exam-kit/ExamKit';

const ExamPage: React.FC = () => {
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [examList, setExamList] = useState<ExamKitType[]>([]);

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
      const res = await examKitAPI.getAllExamKit(
        undefined,
        undefined,
        '',
        discipline
      );
      if (res?.data?.success) {
        setExamList(res?.data?.payload?.examKit);
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
          Sắp xếp
        </Typography.Paragraph>
        <div className='flex items-center gap-[16px]'>
          <Typography.Paragraph className='text-lg mt-[10px]'>
            Ngày đăng tải:{' '}
          </Typography.Paragraph>
          <Select
            style={{ width: 200 }}
            options={[
              { value: 'desc', label: 'Giảm dần' },
              { value: 'asc', label: 'Tăng dần' },
            ]}
            onChange={(value) => {
              message.info('Tính năng đang được phát triển');
            }}
          />
        </div>
      </Row>
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
              dataList={examList?.map((item) => {
                return {
                  ...item,
                  extraTitleDesc: (
                    <div>
                      <div>
                        <p className='text-lg'>
                          Thời lượng làm bài: {item?.testTime}p
                        </p>
                        <p className='text-lg'>
                          Số câu hỏi: {item?.totalQuestion}
                        </p>
                      </div>
                    </div>
                  ),
                  content: item?.description,
                  description: 'Giáo viên đăng tải: ......',
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
