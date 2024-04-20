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
  testTime: number;
  description: string
};
