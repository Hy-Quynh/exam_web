export type ExamDataType = {
  name: string;
  disciplineId: string;
  adminId?: string;
  questionData: {
    question: string;
    answerList: [
      {
        answer: string;
        isTrue: boolean;
      }
    ];
  }[];
  description: string
  chapterId: string
  teacherCode: string
};
