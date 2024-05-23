import { DisciplineDataType } from '../../types/discipline';
import axiosConfig from '../axiosConfig';

const URL = '/discipline';

export const disciplineAPI = {
  getAllDiscipline: async (
    limit?: number,
    offset?: number,
    search?: string,
    subject?: string
  ) => {
    const response = await axiosConfig.get(
      `${URL}?limit=${limit}&offset=${offset}&search=${search}&subject=${subject}`
    );
    return response;
  },

  getDisciplineById: async (disciplineId: number) => {
    const response = await axiosConfig.get(`${URL}/${disciplineId}`);
    return response;
  },

  addNewDiscipline: async (data: DisciplineDataType) => {
    const response = await axiosConfig.post(`${URL}`, { ...data });
    return response;
  },

  deleteDiscipline: async (disciplineId: string) => {
    const response = await axiosConfig.delete(`${URL}/${disciplineId}`);
    return response;
  },

  updateDiscipline: async (disciplineId: string, data: DisciplineDataType) => {
    const response = await axiosConfig.put(`${URL}/${disciplineId}`, {
      ...data,
    });
    return response;
  },

  updateDisciplineStatus: async (disciplineId: string, status: boolean) => {
    const response = await axiosConfig.patch(`${URL}/${disciplineId}/status`, {
      status,
    });
    return response;
  },
  
};
