import { Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY } from '../../../../constants/table';
import { examResultAPI } from '../../../../services/exam-result';
import { useParams } from 'react-router-dom';
import { roundToTwo } from '../../../../utils/number';

type ExamProgressProps = {
  handleSetAnswer: (answer: any) => void;
  handleSetQuestion: (question: any) => void;
  handleSetScore: (score: number) => void;
  handleSetIsSubmit: (isSubmit: boolean) => void;
};

function ExamProgress({
  handleSetAnswer,
  handleSetQuestion,
  handleSetScore,
  handleSetIsSubmit,
}: ExamProgressProps) {
  const [percent, setPercent] = useState(0);

  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});
  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        if (!useInfo?.username) {
          return;
        }

        if (!params.examKitId) {
          return;
        }

        const progress = await examResultAPI.getExamProgress(
          useInfo?.username,
          params.examKitId
        );

        if (progress?.data?.success) {
          const percent =
            (Object.keys(progress?.data?.payload?.answer).length /
              progress?.data?.payload?.questionData?.length) *
            100;

          setPercent(percent);
          handleSetScore(progress?.data?.payload?.score);
          handleSetQuestion(progress?.data?.payload?.questionData);
          handleSetAnswer(progress?.data?.payload?.answer);
          handleSetIsSubmit(true);
        }
      } catch (error) {
        console.log('get progress error >> ', error);
      }
    })();
  }, []);

  return <Progress type='circle' percent={roundToTwo(percent)} />;
}

export default ExamProgress;
