import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExamType } from '../../admin/exam/Exam';
import { examAPI } from '../../../services/exams';
import { Button, Card, Checkbox, Form, Typography, message } from 'antd';
import {
  CheckSquareOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { shuffleArray } from '../../../utils/array';

function ExamDetail() {
  const [examDetail, setExamDetail] = useState<ExamType>();
  const params = useParams();

  const getExamDetail = async (examId: string) => {
    try {
      const res = await examAPI.getExamById(examId);
      if (res?.data?.success) {
        const payload: any = { ...res?.data?.payload };
        if (payload?.isReverse && payload.questionData?.length) {
          payload.questionData = shuffleArray([...payload?.questionData]);
        }
        setExamDetail(payload);
      }
    } catch (error) {
      console.log('get exam detail error >> ', error);
    }
  };

  useEffect(() => {
    if (params.examId) {
      getExamDetail(params.examId);
    }
  }, [params.examId]);

  return (
    <Card style={{ justifyContent: 'flex-start' }}>
      <Typography.Paragraph className='text-3xl font-bold'>
        {examDetail?.name}
      </Typography.Paragraph>
      <Typography.Paragraph className='text-xl font-bold'>
        Môn học: {examDetail?.disciplineName}
      </Typography.Paragraph>
      <div className='flex justify-around p-[20px] bg-[#d4d9d5] rounded-lg'>
        <div className='text-lg'>
          <CheckSquareOutlined />
          {examDetail?.questionData?.length} câu
        </div>
        <div className='text-lg'>
          <FieldTimeOutlined />
          {examDetail?.testTime} phút
        </div>
        <div className='text-lg'>
          <UserOutlined />
          ... lượt kiểm tra
        </div>
      </div>
      <div className='mt-[24px] flex flex-col justify-start items-start'>
        {examDetail?.questionData?.map((item: any, index: number) => {
          return (
            <div key={`question-${index}-${item?._id}`} className='mt-[20px]'>
              <div className='text-xl'>
                <span className='font-bold'>Câu hỏi {index + 1}:</span>{' '}
                {item?.question}
              </div>
              <div className='flex flex-col justify-start items-start'>
                {item?.answerList?.map((answerItem: any, answerIndex: any) => {
                  return (
                    <Checkbox key={`answer-${answerIndex}-${answerItem?._id}`}>
                      <p className='text-lg'>{answerItem?.answer}</p>
                    </Checkbox>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className='mt-[48px]'>
        <Button
          className='bg-primary text-white text-lg pb-[35px] pt-[5px] px-[60px] hover:!bg-primary hover:!text-white'
          onClick={() => {
            message.info('Tính năng đang được phát triển');
          }}
        >
          Nộp bài
        </Button>
      </div>
    </Card>
  );
}

export default ExamDetail;
