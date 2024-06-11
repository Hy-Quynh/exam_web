import { SubjectDataType } from '../../types/subject';
import axiosConfig from '../axiosConfig';

const URL = '/subject';

export const subjectAPI = {
  getAllSubject: async(limit?: number, offset?: number, search?: string, status?: boolean) => {
    const response = await axiosConfig.get(`${URL}?limit=${limit}&offset=${offset}&search=${search}&status=${status}`);
    return response;
  },

  getSubjectById: async(subjectId: number) => {
    const response = await axiosConfig.get(`${URL}/${subjectId}`);
    return response;
  },

  addNewSubject: async(data: SubjectDataType) => {
    const response = await axiosConfig.post(`${URL}`, {...data});
    return response;
  },

  deleteSubject: async(subjectId: string) => {
    const response = await axiosConfig.delete(`${URL}/${subjectId}`);
    return response;
  },

  updateSubject: async(subjectId: string, data: SubjectDataType) => {
    const response = await axiosConfig.put(`${URL}/${subjectId}`, {...data});
    return response;
  },

  updateSubjectStatus: async(subjectId: string, status: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${subjectId}/status`, {status});
    return response;
  },

  getSubjectDiscipline: async(status: boolean) => {
    const response = await axiosConfig.get(`${URL}/discipline/list?status=${status}`);
    return response;
  },
};
