import {
  ReadOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  ContainerOutlined,
} from '@ant-design/icons';
import { ROUTER } from '../../enums/router/router';
import { parseJSON } from '../../utils/handleData';
import { LOGIN_KEY } from '../../constants/table';
import { LOGIN_TYPE } from '../../enums';

export function MenuItem() {
  const allItem = [
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
          Bộ đề
        </a>
      ),
      style:
        window.location.pathname === ROUTER?.ADMIN_EXAM
          ? { background: 'white', color: 'black' }
          : {},
      isTeacher: true,
    },
    {
      key: 'admin-exam-kit',
      icon: <ContainerOutlined />,
      label: (
        <a href={ROUTER.ADMIN_EXAM_KIT} className='text-base'>
          Đề thi
        </a>
      ),
      style:
        window.location.pathname === ROUTER?.ADMIN_EXAM_KIT
          ? { background: 'white', color: 'black' }
          : {},
      isTeacher: true,
    },
    {
      key: 'admin-exam-history',
      icon: <ContainerOutlined />,
      label: (
        <a href={ROUTER.ADMIN_EXAM_HISTORY} className='text-base'>
          DS nộp bài thi
        </a>
      ),
      style:
        window.location.pathname === ROUTER?.ADMIN_EXAM_HISTORY
          ? { background: 'white', color: 'black' }
          : {},
      isTeacher: true,
    },
    {
      key: 'admin-document-history',
      icon: <ContainerOutlined />,
      label: (
        <a href={ROUTER.ADMIN_DOCUMENT_HISTORY} className='text-base'>
          DS ôn tập
        </a>
      ),
      style:
        window.location.pathname === ROUTER?.ADMIN_DOCUMENT_HISTORY
          ? { background: 'white', color: 'black' }
          : {},
      isTeacher: true,
    },
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

  let userInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  return userInfo?.type === LOGIN_TYPE.TEACHER
    ? allItem?.filter((item) => item?.isTeacher)
    : allItem;
}
