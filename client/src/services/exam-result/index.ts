import axiosConfig from '../axiosConfig';

const URL = '/exam-result';

type submitData = {
  examId?: string;
  disciplineId?: string;
  answer?: any;
  questionData?: any;
  score?: number;
  totalTime?: number;
  studentCode?: string;
  studentName?: string;
};

export const examResultAPI = {
  getExamResultByStudent: async (
    studentCode: string,
    limit?: number,
    offset?: number,
    disciplineId?: string,
    teacherCode?: string,
    isGetAll?: boolean
  ) => {
    const response = await axiosConfig.get(
      `${URL}?studentCode=${studentCode}&limit=${limit}&offset=${offset}&disciplineId=${disciplineId}&teacherCode=${teacherCode}&isGetAll=${isGetAll}`
    );
    return response;
  },

  submitExam: async (submitData: submitData) => {
    const response = await axiosConfig.post(`${URL}/submit`, submitData);
    return response;
  },

  getExamProgress: async (studentCode: string, examId: string) => {
    const response = await axiosConfig.get(
      `${URL}/progress?studentCode=${studentCode}&examId=${examId}`
    );
    return response;
  },
};
