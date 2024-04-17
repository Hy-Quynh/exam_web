import { AdminDataType, AdminLoginBodyType } from '../../types/administration';
import axiosConfig from '../axiosConfig';

const URL = '/admin';

export const adminAPI = {
  adminSignUp: async (signUpData: AdminDataType) => {
    const response = await axiosConfig.post(`${URL}/signup`, { ...signUpData });
    return response;
  },

  adminLogin: async (loginData: AdminLoginBodyType) => {
    const response = await axiosConfig.post(`${URL}/login`, { ...loginData });
    return response;
  },

  getAdminList: async () => {
    const response = await axiosConfig.get(`${URL}`);
    return response;
  },

  getAdminById: async (adminId: string) => {
    const response = await axiosConfig.get(`${URL}/${adminId}`);
    return response;
  },

  updateAdminInfo: async (adminId: string, adminData: AdminDataType) => {
    const response = await axiosConfig.put(`${URL}/${adminId}`, {
      ...adminData,
    });
    return response;
  },

  deleteAdmin: async (adminId: string) => {
    const response = await axiosConfig.delete(`${URL}/${adminId}`);
    return response;
  },

  updateAdminStatus: (adminId: string, status: boolean) => {
    return axiosConfig.patch(`${URL}/${adminId}/status`, {
      status,
    });
  },
};
