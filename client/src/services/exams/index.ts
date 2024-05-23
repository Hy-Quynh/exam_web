import { ExamDataType } from '../../types/exam';
import axiosConfig from '../axiosConfig';

const URL = '/exam';

export const examAPI = {
  getAllExam: async (
    limit?: number,
    offset?: number,
    search?: string,
    discipline?: string,
    subject?: string,
    chapter?: string
  ) => {
    const response = await axiosConfig.get(
      `${URL}?limit=${limit}&offset=${offset}&search=${search}&discipline=${discipline}&subject=${subject}&chapter=${chapter}`
    );
    return response;
  },

  getExamById: async (examId: string) => {
    const response = await axiosConfig.get(`${URL}/${examId}`);
    return response;
  },

  addNewExam: async (data: ExamDataType) => {
    const response = await axiosConfig.post(`${URL}`, { ...data });
    return response;
  },

  deleteExam: async (examId: string) => {
    const response = await axiosConfig.delete(`${URL}/${examId}`);
    return response;
  },

  updateExam: async (examId: string, data: ExamDataType) => {
    const response = await axiosConfig.put(`${URL}/${examId}`, {
      ...data,
    });
    return response;
  },

  updateExamStatus: async (examId: string, status: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${examId}/status`, {
      status,
    });
    return response;
  },

  checkExistDisciplineExamChapter: async (
    disciplineId: string,
    chapterId: string
  ) => {
    const response = await axiosConfig.get(
      `${URL}/check-exist/discipline-chapter/${disciplineId}/${chapterId}`
    );
    return response;
  },
};
