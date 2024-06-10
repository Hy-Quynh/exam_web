import { message } from 'antd';
import LoginPage from '../../../components/login/Login';
import { authAPI } from '../../../services/auth';
import { LOGIN_KEY } from '../../../constants/table';
import { LOGIN_TYPE } from '../../../enums';
import { useNavigate } from 'react-router-dom';
import { ROUTER } from '../../../enums/router/router';

const ClientLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (value: any) => {
    try {
      const res = await authAPI.login(value);

      if (res?.data?.username) {
        localStorage.setItem(LOGIN_KEY, JSON.stringify(res?.data));
        message.info('Bạn đã đăng nhập thành công');

        if (res?.data?.type === LOGIN_TYPE.TEACHER) {
          navigate(ROUTER.ADMIN_EXAM);
        }else {
          navigate('/')
        }
      }else {
        message.error(res?.data?.message || 'Bạn đã đăng nhập nhất bại')
      }
    } catch (error) {
      console.log('handleLogin error >>> ', error);
      message.error('Đăng nhập thất bại');
    }
  };

  return <LoginPage handleLogin={(value) => handleLogin(value)} />;
};

export default ClientLogin;
