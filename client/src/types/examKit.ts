export type ExamKitDataType = {
  name: string,
  disciplineId: string,
  description: string,
  testTime: number,
  examStructure: ExamKitQuestionStructure[],
  year: number,
  teacherCode: string
};

export type ExamKitQuestionStructure = {
  chapterId: string, 
  numberQuestion: string
}
