import axiosConfig from '../axiosConfig';

const URL = '/login';

export const authAPI = {
  login: async (loginData: { password: string; userCode: string }) => {
    const response = await axiosConfig.post(`${URL}`, { ...loginData });
    return response;
  },
};
