import { Navigate } from 'react-router-dom';
import { parseJSON } from '../../utils/handleData';
import { LOGIN_KEY } from '../../constants/table';
import { LOGIN_TYPE } from '../../enums';

const PrivateClientLayout = (props: any) => {
  let customerData = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  return customerData?.type === LOGIN_TYPE.STUDENT ? (
    props.children
  ) : (
    <Navigate to='/login' />
  );
};

export default PrivateClientLayout;
