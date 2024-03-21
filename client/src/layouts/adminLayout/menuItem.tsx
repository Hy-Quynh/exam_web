import {
  ReadOutlined,
  TeamOutlined,
  SnippetsOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ROUTER } from '../../enums/auths/router';

export const MenuItem = [
  {
    key: 'admin-dashboard',
    icon: <BarChartOutlined />,
    label: (
      <a href={ROUTER?.ADMIN} className='text-lg'>
        Thống kê
      </a>
    ),
  },
  {
    key: 'admin-discipline',
    icon: <SnippetsOutlined />,
    label: (
      <a href={ROUTER?.ADMIN_DISCIPLINE} className='text-lg'>
        Bộ môn
      </a>
    ),
  },
  {
    key: 'admin-teacher',
    icon: <TeamOutlined />,
    label: (
      <a href={ROUTER.ADMIN_TEACHER} className='text-lg'>
        Giáo viên
      </a>
    ),
  },
  {
    key: 'admin-subject',
    icon: <ReadOutlined />,
    label: (
      <a href={ROUTER.ADMIN_SUBJECT} className='text-lg'>
        Môn học
      </a>
    ),
  },
];
