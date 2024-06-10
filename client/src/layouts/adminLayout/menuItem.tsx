import {
  ReadOutlined,
  TeamOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  ContainerOutlined,
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
    style:
      window.location.pathname === ROUTER?.ADMIN
        ? { background: 'white', color: 'black' }
        : {},
  },
  {
    key: 'admin-discipline',
    icon: <SnippetsOutlined />,
    label: (
      <a href={ROUTER?.ADMIN_SUBJECT} className='text-base'>
        Bộ môn
      </a>
    ),
    style:
      window.location.pathname === ROUTER?.ADMIN_SUBJECT
        ? { background: 'white', color: 'black' }
        : {},
  },
  {
    key: 'admin-subject',
    icon: <ReadOutlined />,
    label: (
      <a href={ROUTER.ADMIN_DISCIPLINE} className='text-base'>
        Môn học
      </a>
    ),
    style:
      window.location.pathname === ROUTER?.ADMIN_DISCIPLINE
        ? { background: 'white', color: 'black' }
        : {},
  },
  {
    key: 'admin-exam',
    icon: <FileTextOutlined />,
    label: (
      <a href={ROUTER.ADMIN_EXAM} className='text-base'>
        Tài liệu
      </a>
    ),
    style:
      window.location.pathname === ROUTER?.ADMIN_EXAM
        ? { background: 'white', color: 'black' }
        : {},
  },
  {
    key: 'admin-exam-kit',
    icon: <ContainerOutlined />,
    label: (
      <a href={ROUTER.ADMIN_EXAM_KIT} className='text-base'>
        Đề kiểm tra
      </a>
    ),
    style:
      window.location.pathname === ROUTER?.ADMIN_EXAM_KIT
        ? { background: 'white', color: 'black' }
        : {},
  },
  {
    key: 'admin-exam-submission',
    icon: <ContainerOutlined />,
    label: (
      <a href={ROUTER.ADMIN_EXAM_SUBMISSION} className='text-base'>
        DS nộp bài
      </a>
    ),
    style:
      window.location.pathname === ROUTER?.ADMIN_EXAM_SUBMISSION
        ? { background: 'white', color: 'black' }
        : {},
  },
  // {
  //   key: 'admin-teacher',
  //   icon: <TeamOutlined />,
  //   label: (
  //     <a href={ROUTER.ADMIN_TEACHER} className='text-base'>
  //       Giáo viên
  //     </a>
  //   ),
  //   style:
  //     window.location.pathname === ROUTER?.ADMIN_TEACHER
  //       ? { background: 'white', color: 'black' }
  //       : {},
  // },
  {
    key: 'admin-administration',
    icon: <SettingOutlined />,
    label: (
      <a href={ROUTER.ADMIN_ADMINISTRATION} className='text-base'>
        Quản trị
      </a>
    ),
    style:
      window.location.pathname === ROUTER?.ADMIN_ADMINISTRATION
        ? { background: 'white', color: 'black' }
        : {},
  },
];
