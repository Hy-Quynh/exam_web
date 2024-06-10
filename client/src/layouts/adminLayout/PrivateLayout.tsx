import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { parseJSON } from '../../utils/handleData';
import { LOGIN_KEY } from '../../constants/table';
import { LOGIN_TYPE } from '../../enums';

const AdminPrivate = () => {
  let customerData = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  return customerData?.type === LOGIN_TYPE.ADMIN ||
    customerData?.type === LOGIN_TYPE.TEACHER ? (
    <AdminLayout />
  ) : (
    <Navigate to='/admin/login' />
  );
};

export default AdminPrivate;
