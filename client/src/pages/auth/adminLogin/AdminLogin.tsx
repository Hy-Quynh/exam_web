import LoginPage from '../../../components/login/Login';
import AdminIcon from '../../../assets/imgs/admin_icon.png';
import { message } from 'antd';
import { adminAPI } from '../../../services/admins';
import { LOGIN_KEY } from '../../../constants/table';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (value: any) => {
    try {
      const res = await adminAPI.adminLogin(value);
      if (res?.data?.success) {
        message.success('Đăng nhập thành công');
        localStorage.setItem(LOGIN_KEY, JSON.stringify(res?.data?.payload));
        navigate('/admin');
      } else {
        message.error(res?.data?.error?.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      message.error('Đăng nhập thất bại');
    }
  };

  return (
    <LoginPage
      bg='bg-adminMenuBg'
      icon={AdminIcon}
      titleText='TRANG QUẢN TRỊ'
      descText='Vui lòng nhập thông tin Tên Đăng Nhập và Mật Khẩu của bạn!'
      loginButtonColor='bg-adminMenuBg'
      loginButtonText='text-white'
      handleLogin={(value) => handleLogin(value)}
    />
  );
};

export default AdminLogin;
