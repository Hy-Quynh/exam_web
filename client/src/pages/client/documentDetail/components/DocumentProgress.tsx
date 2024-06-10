import { Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY } from '../../../../constants/table';
import { documentResultAPI } from '../../../../services/document-result';
import { useParams } from 'react-router-dom';

type DocumentProgressProps = {
  handleSetAnswer: (answer: any) => void;
  handleSetQuestion: (question: any) => void;
};

function DocumentProgress({
  handleSetAnswer,
  handleSetQuestion,
}: DocumentProgressProps) {
  const [percent, setPercent] = useState(0);

  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});
  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        if (!useInfo?.username) {
          return;
        }

        if (!params.examId) {
          return;
        }

        const progress = await documentResultAPI.getDocumentProgress(
          useInfo?.username,
          params.examId
        );

        if (progress?.data?.success) {
          const percent =
            (Object.keys(progress?.data?.payload?.answer).length /
            progress?.data?.payload?.questionData?.length) *
            100;

          setPercent(percent);

          if (!progress?.data?.payload?.isSubmit) {
            handleSetQuestion(progress?.data?.payload?.questionData);
            handleSetAnswer(progress?.data?.payload?.answer);
          }
        }
      } catch (error) {
        console.log('get progress error >> ', error);
      }
    })();
  }, []);

  return <Progress type='circle' percent={percent} />;
}

export default DocumentProgress;
