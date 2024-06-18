import { ExamKitDataType } from '../../types/examKit';
import axiosConfig from '../axiosConfig';

const URL = '/exam-kit';

export const examKitAPI = {
  getAllExamKit: async (
    limit?: number,
    offset?: number,
    search?: string,
    discipline?: string,
    teacherCode?: string,
    status?: boolean,
    subject?: string
  ) => {
    const response = await axiosConfig.get(
      `${URL}?limit=${limit}&offset=${offset}&search=${search}&discipline=${discipline}&teacherCode=${teacherCode}&status=${status}&subject=${subject}`
    );
    return response;
  },

  getExamKitById: async (examKitId: string) => {
    const response = await axiosConfig.get(`${URL}/${examKitId}`);
    return response;
  },

  addNewExamKit: async (data: ExamKitDataType) => {
    const response = await axiosConfig.post(`${URL}`, { ...data });
    return response;
  },

  deleteExamKit: async (examKitId: string) => {
    const response = await axiosConfig.delete(`${URL}/${examKitId}`);
    return response;
  },

  updateExamKit: async (examKitId: string, data: ExamKitDataType) => {
    const response = await axiosConfig.put(`${URL}/${examKitId}`, {
      ...data,
    });
    return response;
  },

  updateExamKitStatus: async (examKitId: string, status: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${examKitId}/status`, {
      status,
    });
    return response;
  },

  updateExamKitReverse: async (examKitId: string, isReverse: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${examKitId}/reverse`, {
      isReverse,
    });
    return response;
  },

  getExamKitQuestion: async (examKitId: string) => {
    const response = await axiosConfig.get(`${URL}/${examKitId}/question`);
    return response;
  },

  updateExamKitReverseAnswer: async (examKitId: string, isReverse: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${examKitId}/reverse/answer`, {
      isReverse,
    });
    return response;
  },
  updateExamKitOpen: async (examKitId: string, isOpen: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${examKitId}/open`, {
      isOpen,
    });
    return response;
  },
};
