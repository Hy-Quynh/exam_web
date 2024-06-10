import axiosConfig from '../axiosConfig';

const URL = '/document-result';

type submitData = {
  documentId: string;
  disciplineId: string;
  answer: any;
  questionData: any;
  score: number;
  totalTime: number;
  studentCode: string;
  studentName: string;
  isSubmit: boolean;
};

export const documentResultAPI = {
  getDocumentResultByStudent: async (
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

  submitDocument: async (submitData: submitData) => {
    const response = await axiosConfig.post(`${URL}/submit`, submitData);
    return response;
  },

  getDocumentProgress: async (studentCode: string, documentId: string) => {
    const response = await axiosConfig.get(
      `${URL}/progress?studentCode=${studentCode}&documentId=${documentId}`
    );
    return response;
  },
};
