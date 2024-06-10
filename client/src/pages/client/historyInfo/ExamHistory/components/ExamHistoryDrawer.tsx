import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../../utils/handleData';
import { LOGIN_KEY } from '../../../../../constants/table';
import QuesionData from '../../../../../components/quesionData/QuesionData';
import { examResultAPI } from '../../../../../services/exam-result';

type Props = {
  open: boolean;
  handleClose: () => void;
  examId: string;
};

function ExamHistoryDrawer({ open, handleClose, examId }: Props) {
  const [questionData, setQuestionData] = useState([]);
  const [answerList, setAnserList] = useState({});
  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  useEffect(() => {
    (async () => {
      try {
        if (!useInfo?.username) {
          return;
        }

        const progress = await examResultAPI.getExamProgress(
          useInfo?.username,
          examId
        );

        if (progress?.data?.success) {
          setQuestionData(progress?.data?.payload?.questionData);
          setAnserList(progress?.data?.payload?.answer);
        }
      } catch (error) {
        console.log('get progress error >> ', error);
      }
    })();
  }, []);

  return (
    <Drawer
      title='Đáp án'
      onClose={handleClose}
      open={open}
      width={'50vw'}
    >
      <div className='mx-[50px]'>
        <QuesionData
          answerList={answerList}
          questionData={questionData}
          examStatus={'RESULT'}
          setAnswerList={() => {}}
        />
      </div>
    </Drawer>
  );
}

export default ExamHistoryDrawer;
