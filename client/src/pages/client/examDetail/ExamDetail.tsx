import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Typography, message } from 'antd';
import {
  CheckSquareOutlined,
  FieldTimeOutlined,
  UserOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { shuffleArray } from '../../../utils/array';
import { examKitAPI } from '../../../services/exam-kit';
import { ExamKitType } from '../../admin/exam-kit/ExamKit';
import { Markup } from 'interweave';
import './style.scss';
import { formatCountDownTime } from '../../../utils/datetime';

function ExamDetail() {
  const [examStatus, setExamStatus] = useState<
    'NOT_START' | 'START' | 'SUBMIT' | 'RESULT'
  >('NOT_START');
  const [answerList, setAnswerList] = useState<any>({});
  const [countDownTime, setCountDownTime] = useState<number>(0);
  const [examKitDetail, setExamKitDetail] = useState<ExamKitType>();
  const [score, setScore] = useState<number>(0);
  const params = useParams();
  const timer = useRef<any>(null);

  const getExamKitDetail = async (examKitId?: string) => {
    try {
      if (!examKitId) {
        return message.error('Mã đề không chính xác');
      }
      const res = await examKitAPI.getExamKitQuestion(examKitId);
      if (res?.data?.success) {
        const payload: any = { ...res?.data?.payload };
        setCountDownTime(payload?.testTime);
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

  useEffect(() => {
    if (examStatus === 'START') {
      timer.current = setInterval(() => {
        setCountDownTime((preValue) => {
          if (preValue === 1) {
            clearInterval(timer.current);
            return 0;
          }
          return preValue - 1;
        });
      }, 1000 * 60);
    }
    return () => clearInterval(timer.current);
  }, [examStatus]);

  return (
    <Card style={{ justifyContent: 'flex-start', minHeight: '500px' }}>
      <Typography.Paragraph className='text-2xl font-bold'>
        {examKitDetail?.name}
      </Typography.Paragraph>
      <Typography.Paragraph className='text-lg font-bold'>
        Môn học: {examKitDetail?.disciplineName}
      </Typography.Paragraph>
      <div className='flex justify-around p-[20px] bg-[#d4d9d5] rounded-lg sticky top-0 z-50'>
        <div className='text-base'>
          <CheckSquareOutlined className='mr-[5px]' />
          {examStatus === 'NOT_START'
            ? `${examKitDetail?.totalQuestion} câu`
            : `${Object.keys(answerList).length}/${
                examKitDetail?.totalQuestion
              } câu`}
        </div>
        <div className='text-lg font-bold'>
          <FieldTimeOutlined className='mr-[5px]' />
          {examStatus === 'NOT_START'
            ? `${countDownTime} phút`
            : formatCountDownTime(countDownTime)}
        </div>
        <div className='text-base'>
          <UserOutlined className='mr-[5px]' />
          ... lượt kiểm tra
        </div>
      </div>
      {examStatus === 'START' || examStatus === 'RESULT' ? (
        <div className='mt-[24px] flex flex-col justify-start items-start'>
          {examKitDetail?.questionData?.map((item: any, index: number) => {
            return (
              <div key={`question-${index}-${item?._id}`} className='mt-[20px]'>
                <p className='font-bold text-lg text-left'>
                  Câu hỏi {index + 1}:
                </p>
                <div className='question-content mb-[10px]'>
                  <Markup content={item?.question || ''} />
                </div>

                <div className='flex flex-col justify-start items-start'>
                  {item?.answerList?.map(
                    (answerItem: any, answerIndex: any) => {
                      return examStatus === 'RESULT' ? (
                        <Checkbox disabled={true} checked={answerItem?.isTrue}>
                          <p className='text-base'>
                            {answerItem?.answer}

                            <span className='ml-[10px]'>
                              {answerList[item?._id]?.includes(
                                answerItem?._id
                              ) ? (
                                answerItem?.isTrue ? (
                                  <CheckOutlined />
                                ) : (
                                  <CloseOutlined />
                                )
                              ) : (
                                <></>
                              )}
                            </span>
                          </p>
                        </Checkbox>
                      ) : (
                        <Checkbox
                          key={`answer-${answerIndex}-${answerItem?._id}`}
                          onChange={(event) => {
                            const newAnswerList = JSON.parse(
                              JSON.stringify(answerList)
                            );

                            if (event.target.checked) {
                              if (
                                newAnswerList[item?._id] &&
                                newAnswerList[item?._id]?.length
                              ) {
                                const data = [...newAnswerList[item?._id]];
                                data.push(answerItem?._id);
                                newAnswerList[item._id] = [...data];
                              } else {
                                newAnswerList[item._id] = [answerItem?._id];
                              }
                            } else {
                              const data = [
                                ...newAnswerList[item?._id],
                              ]?.filter((it) => it !== answerItem?._id);

                              if (data?.length) {
                                newAnswerList[item._id] = [...data];
                              } else {
                                delete newAnswerList[item._id];
                              }
                            }

                            setAnswerList(newAnswerList);
                          }}
                        >
                          <p className='text-base'>{answerItem?.answer}</p>
                        </Checkbox>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : examStatus === 'SUBMIT' ? (
        <div>
          <p className='mt-[100px] mb-[150px] text-3xl font-bold text-[#669404]'>
            Điểm số: {score.toFixed(1)} / 10
          </p>
        </div>
      ) : (
        <></>
      )}

      <div className='mt-[48px]'>
        <Button
          className='bg-primary text-white text-lg pb-[35px] pt-[5px] px-[60px] hover:!bg-primary hover:!text-white'
          onClick={() => {
            switch (examStatus) {
              case 'NOT_START': {
                setExamStatus('START');
                break;
              }

              case 'START': {
                if (
                  Object.keys(answerList).length !==
                  examKitDetail?.totalQuestion
                ) {
                  return message.error(
                    'Cần trả lời đầy đủ câu hỏi trước khi nộp bài'
                  );
                }
                const questionData = [...examKitDetail?.questionData];
                const sentenceScore = 10 / questionData?.length;
                let totalScore = 0;

                questionData.forEach((question) => {
                  const questionAnswer = answerList[question._id];
                  const correctAnswer = question?.answerList
                    ?.filter((it: any) => it?.isTrue)
                    ?.map((it: any) => it?._id);
                  const scoreCorrect = sentenceScore / correctAnswer?.length;
                  const totalCorrectAnswer = questionAnswer?.filter((el: any) =>
                    correctAnswer?.includes(el)
                  );
                  totalScore += totalCorrectAnswer?.length * scoreCorrect;
                });
                setScore(totalScore);
                setExamStatus('SUBMIT');
                break;
              }
              case 'SUBMIT': {
                setExamStatus('RESULT');
                break;
              }
              case 'RESULT': {
                setExamStatus('SUBMIT');
                break;
              }
              default:
                break;
            }
          }}
        >
          {examStatus === 'NOT_START'
            ? 'Bắt đầu'
            : examStatus === 'START'
            ? 'Nộp bài'
            : examStatus === 'SUBMIT'
            ? 'Xem đáp án'
            : 'Xem điểm số'}
        </Button>
      </div>
    </Card>
  );
}

export default ExamDetail;
