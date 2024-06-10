export type ExamKitDataType = {
  name: string,
  disciplineId: string,
  description: string,
  testTime: number,
  totalQuestion: number,
  examStructure: ExamKitQuestionStructure[],
  year: number,
  semester: number,
  startTime: string,
  teacherCode: string
};

export type ExamKitQuestionStructure = {
  chapterId: string, 
  numberQuestion: string
}
