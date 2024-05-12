export type ExamKitDataType = {
  name: string,
  disciplineId: string,
  description: string,
  testTime: number,
  totalQuestion: number,
  examStructure: ExamKitQuestionStructure[],
};

export type ExamKitQuestionStructure = {
  chapterId: string, 
  numberQuestion: string
}
