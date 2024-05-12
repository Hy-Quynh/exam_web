import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Typography, message } from 'antd';
import {
  CheckSquareOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { shuffleArray } from '../../../utils/array';
import { examKitAPI } from '../../../services/exam-kit';
import { ExamKitType } from '../../admin/exam-kit/ExamKit';

function ExamDetail() {
  const [examKitDetail, setExamKitDetail] = useState<ExamKitType>();
  const params = useParams();

  const getExamKitDetail = async (examKitId: string) => {
    try {
      const res = await examKitAPI.getExamKitQuestion(examKitId);
      if (res?.data?.success) {
        const payload: any = { ...res?.data?.payload };
        if (payload?.isReverse && payload.questionData?.length) {
          payload.questionData = shuffleArray([...payload?.questionData]);
        }
        setExamKitDetail(payload);
      }
    } catch (error) {
      console.log('get exam detail error >> ', error);
    }
  };

  useEffect(() => {
    if (params.examKitId) {
      getExamKitDetail(params.examKitId);
    }
  }, [params.examKitId]);

  return (
    <Card style={{ justifyContent: 'flex-start' }}>
      <Typography.Paragraph className='text-2xl font-bold'>
        {examKitDetail?.name}
      </Typography.Paragraph>
      <Typography.Paragraph className='text-lg font-bold'>
        Môn học: {examKitDetail?.disciplineName}
      </Typography.Paragraph>
      <div className='flex justify-around p-[20px] bg-[#d4d9d5] rounded-lg sticky top-0 z-50'>
        <div className='text-base'>
          <CheckSquareOutlined />
          {examKitDetail?.totalQuestion} câu
        </div>
        <div className='text-base'>
          <FieldTimeOutlined />
          {examKitDetail?.testTime} phút
        </div>
        <div className='text-base'>
          <UserOutlined />
          ... lượt kiểm tra
        </div>
      </div>
      <div className='mt-[24px] flex flex-col justify-start items-start'>
        {examKitDetail?.questionData?.map((item: any, index: number) => {
          return (
            <div key={`question-${index}-${item?._id}`} className='mt-[20px]'>
              <div className='text-lg'>
                <span className='font-bold'>Câu hỏi {index + 1}:</span>{' '}
                {item?.question}
              </div>
              <div className='flex flex-col justify-start items-start'>
                {item?.answerList?.map((answerItem: any, answerIndex: any) => {
                  return (
                    <Checkbox key={`answer-${answerIndex}-${answerItem?._id}`}>
                      <p className='text-base'>{answerItem?.answer}</p>
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
