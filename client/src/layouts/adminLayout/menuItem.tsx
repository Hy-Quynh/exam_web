import {
  ReadOutlined,
  TeamOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  CloudDownloadOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import { ROUTER } from '../../enums/router/router';

export const MenuItem = [
  {
    key: 'admin-dashboard',
    icon: <BarChartOutlined />,
    label: (
      <a href={ROUTER?.ADMIN} className='text-base'>
        Thống kê
      </a>
    ),
  },
  {
    key: 'admin-discipline',
    icon: <SnippetsOutlined />,
    label: (
      <a href={ROUTER?.ADMIN_SUBJECT} className='text-base'>
        Bộ môn
      </a>
    ),
  },
  {
    key: 'admin-subject',
    icon: <ReadOutlined />,
    label: (
      <a href={ROUTER.ADMIN_DISCIPLINE} className='text-base'>
        Môn học
      </a>
    ),
  },
  {
    key: 'admin-exam',
    icon: <FileTextOutlined />,
    label: (
      <a href={ROUTER.ADMIN_EXAM} className='text-base'>
        Đề kiểm tra
      </a>
    ),
  },
  {
    key: 'admin-exam-kit',
    icon:  <ContainerOutlined />,
    label: (
      <a href={ROUTER.ADMIN_EXAM_KIT} className='text-base'>
        Bộ đề
      </a>
    ),
  },
 
  {
    key: 'admin-document',
    icon: <CloudDownloadOutlined />,
    label: (
      <a href={ROUTER.ADMIN_DOCUMENT} className='text-base'>
        Tài liệu
      </a>
    ),
  },
  {
    key: 'admin-teacher',
    icon: <TeamOutlined />,
    label: (
      <a href={ROUTER.ADMIN_TEACHER} className='text-base'>
        Giáo viên
      </a>
    ),
  },
  {
    key: 'admin-administration',
    icon: <SettingOutlined />,
    label: (
      <a href={ROUTER.ADMIN_ADMINISTRATION} className='text-base'>
        Quản trị
      </a>
    ),
  },
];
