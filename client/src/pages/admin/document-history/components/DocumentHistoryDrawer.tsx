import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { documentResultAPI } from '../../../../services/document-result';
import QuesionData from '../../../../components/quesionData/QuesionData';

type Props = {
  open: boolean;
  handleClose: () => void;
  documentId: string;
  studentCode: string;
};

function DocumentHistoryDrawer({
  open,
  handleClose,
  documentId,
  studentCode,
}: Props) {
  const [questionData, setQuestionData] = useState([]);
  const [answerList, setAnserList] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const progress = await documentResultAPI.getDocumentProgress(
          studentCode,
          documentId
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
    <Drawer title='Đáp án' onClose={handleClose} open={open} width={'50vw'}>
      <div className='mx-[50px]'>
        <QuesionData
          answerList={answerList}
          questionData={questionData?.filter(
            (item: any) => answerList?.[item?._id]?.length
          )}
          examStatus={'RESULT'}
          setAnswerList={() => {}}
        />
      </div>
    </Drawer>
  );
}

export default DocumentHistoryDrawer;
