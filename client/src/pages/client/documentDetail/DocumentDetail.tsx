import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Popconfirm,
  Typography,
  message,
} from 'antd';
import {
  CheckSquareOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './style.scss';
import { formatCountDownTime } from '../../../utils/datetime';
import { examAPI } from '../../../services/exams';
import { shuffleArray } from '../../../utils/array';
import { parseJSON } from '../../../utils/handleData';
import { LOGIN_KEY } from '../../../constants/table';
import { documentResultAPI } from '../../../services/document-result';
import DocumentProgress from './components/DocumentProgress';
import QuesionData from '../../../components/quesionData/QuesionData';

function DocumentDetail() {
  const [examStatus, setExamStatus] = useState<
    'NOT_START' | 'START' | 'SUBMIT' | 'RESULT'
  >('NOT_START');
  const [answerList, setAnswerList] = useState<any>({});
  const [questionData, setQuestionData] = useState<any>([]);
  const [countDownTime, setCountDownTime] = useState<number>(0);
  const [examDetail, setDocumentDetail] = useState<any>();
  const [score, setScore] = useState<number>(0);
  const params = useParams();
  const timer = useRef<any>(null);
  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});
  const navigate = useNavigate();

  const getDocumentDetail = async (examId?: string) => {
    try {
      if (!examId) {
        return message.error('Mã tài liệu không chính xác');
      }
      const res = await examAPI.getExamById(examId);
      if (res?.data?.success) {
        const payload: any = { ...res?.data?.payload };
        if (payload?.isReverse && payload.questionData?.length) {
          payload.questionData = shuffleArray([...payload?.questionData]);
        }

        if (payload?.reverseAnswer) {
          payload.questionData = [...payload.questionData]?.map((item) => {
            return {
              ...item,
              answerList: shuffleArray([...item?.answerList]),
            };
          });
        }
        setDocumentDetail(payload);
      }
    } catch (error) {
      console.log('get exam detail error >> ', error);
    }
  };

  useEffect(() => {
    if (params.examId) {
      getDocumentDetail(params.examId);
    }
  }, [params.examId]);

  useEffect(() => {
    if (examStatus === 'START') {
      timer.current = setInterval(() => {
        setCountDownTime((preValue) => {
          return preValue + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer.current);
  }, [examStatus]);

  const submitDocument = async (type: 'SUBMIT' | 'CANCEL') => {
    try {
      const question = [
        ...(questionData?.length ? questionData : examDetail?.questionData),
      ];
      const sentenceScore = 10 / question?.length;
      let totalScore = 0;

      question.forEach((question) => {
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

      const submitData = {
        documentId: examDetail?._id,
        disciplineId: examDetail?.disciplineId,
        answer: answerList,
        questionData: questionData?.length
          ? questionData
          : examDetail?.questionData,
        score: totalScore,
        totalTime: countDownTime,
        studentCode: useInfo?.username,
        studentName: useInfo?.name,
        isSubmit: type === 'SUBMIT' ? true : false,
      };

      const submitRes = await documentResultAPI.submitDocument(submitData);

      if (submitRes) {
        if (type === 'SUBMIT') {
          message.info('Bạn đã nộp bài thành công');
          setScore(totalScore);
          setExamStatus('SUBMIT');
        } else {
          navigate(-1);
        }
      } else {
        message.error('Nộp bài thất bại');
      }
    } catch (error) {
      message.error('Nộp bài thất bại');
    }
  };

  return (
    <Card style={{ justifyContent: 'flex-start', minHeight: '500px' }}>
      <Typography.Paragraph className='text-2xl font-bold'>
        {examDetail?.name}
      </Typography.Paragraph>
      <Typography.Paragraph className='text-lg font-bold'>
        Môn học: {examDetail?.disciplineName}
      </Typography.Paragraph>
      <Typography.Paragraph className='text-lg font-bold'>
        Chương:{' '}
        {
          examDetail?.disciplineChapters?.find(
            (item: any) => item?._id === examDetail?.chapterId
          )?.name
        }
      </Typography.Paragraph>
      <div className='flex justify-around p-[20px] bg-[#d4d9d5] rounded-lg sticky top-0 z-50'>
        <div className='text-base'>
          <CheckSquareOutlined className='mr-[5px]' />
          {examStatus === 'NOT_START'
            ? `${
                (questionData?.length ? questionData : examDetail?.questionData)
                  ?.length
              } câu`
            : `${Object.keys(answerList).length}/${
                (questionData?.length ? questionData : examDetail?.questionData)
                  ?.length
              } câu`}
        </div>
        <div className='text-lg font-bold'>
          <FieldTimeOutlined className='mr-[5px]' />
          {formatCountDownTime(countDownTime)}
        </div>
        <div className='text-base'>
          <UserOutlined className='mr-[5px]' />
          ... lượt làm đề
        </div>
      </div>
      {examStatus === 'START' || examStatus === 'RESULT' ? (
        <QuesionData
          questionData={
            questionData?.length ? questionData : examDetail?.questionData
          }
          answerList={answerList}
          examStatus={examStatus}
          setAnswerList={(newAnswer) => setAnswerList(newAnswer)}
        />
      ) : examStatus === 'SUBMIT' ? (
        <div>
          <p className='mt-[100px] mb-[150px] text-3xl font-bold text-[#669404]'>
            Điểm số: {score.toFixed(1)} / 10
          </p>
        </div>
      ) : (
        <></>
      )}

      {examStatus === 'NOT_START' ? (
        <div className='mt-[100px] mb-[100px]'>
          <p className='text-xl font-bold text-[#6aa84f] mb-[20px]'>
            Tiến độ làm bài:{' '}
          </p>
          <DocumentProgress
            handleSetAnswer={(anwser) => setAnswerList(anwser)}
            handleSetQuestion={(question) => setQuestionData(question)}
          />
        </div>
      ) : (
        <></>
      )}

      <div className='mt-[48px]'>
        <div className='flex gap-[10px] justify-center'>
          {examStatus === 'START' ? (
            <Popconfirm
              title='Xác nhận'
              description='Bạn có chắc chắn muốn quay lại?'
              onConfirm={() => submitDocument('CANCEL')}
              okText='Quay lại'
              cancelText='Huỷ'
              okButtonProps={{
                className: 'bg-primary',
              }}
            >
              <Button
                type='primary'
                danger
                className='text-lg pb-[35px] pt-[5px] px-[60px]'
              >
                Quay lại
              </Button>
            </Popconfirm>
          ) : (
            <></>
          )}

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
                    (questionData?.length
                      ? questionData
                      : examDetail?.questionData
                    )?.length
                  ) {
                    return message.error(
                      'Cần trả lời đầy đủ câu hỏi trước khi nộp bài'
                    );
                  }
                  submitDocument('SUBMIT');
                  break;
                }
                case 'SUBMIT': {
                  setExamStatus('RESULT');
                  break;
                }
                case 'RESULT': {
                  setAnswerList({});
                  setCountDownTime(0);
                  setExamStatus('NOT_START');
                  setQuestionData([]);
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
              : 'Làm lại'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default DocumentDetail;
