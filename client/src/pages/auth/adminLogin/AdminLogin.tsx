import LoginPage from '../../../components/login/Login';
import AdminIcon from '../../../assets/imgs/admin_icon.png';

const AdminLogin = () => {
  return (
    <LoginPage
      bg='bg-adminMenuBg'
      icon={AdminIcon}
      titleText='TRANG QUẢN TRỊ'
      descText='Vui lòng nhập thông tin Tên Đăng Nhập và Mật Khẩu của bạn!'
      loginButtonColor='bg-adminMenuBg'
      loginButtonText='text-white'
    />
  );
};

export default AdminLogin;
