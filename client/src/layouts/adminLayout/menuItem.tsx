import {
  ReadOutlined,
  TeamOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons';
import { ROUTER } from '../../enums/router/router';

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
      <a href={ROUTER?.ADMIN_SUBJECT} className='text-lg'>
        Bộ môn
      </a>
    ),
  },
  {
    key: 'admin-subject',
    icon: <ReadOutlined />,
    label: (
      <a href={ROUTER.ADMIN_DISCIPLINE} className='text-lg'>
        Môn học
      </a>
    ),
  },
  {
    key: 'admin-exam',
    icon: <FileTextOutlined />,
    label: (
      <a href={ROUTER.ADMIN_EXAM} className='text-lg'>
        Đề kiểm tra
      </a>
    ),
  },
  {
    key: 'admin-document',
    icon: <CloudDownloadOutlined />,
    label: (
      <a href={ROUTER.ADMIN_DOCUMENT} className='text-lg'>
        Tài liệu
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
    key: 'admin-administration',
    icon: <SettingOutlined />,
    label: (
      <a href={ROUTER.ADMIN_ADMINISTRATION} className='text-lg'>
        Quản trị
      </a>
    ),
  },
];
