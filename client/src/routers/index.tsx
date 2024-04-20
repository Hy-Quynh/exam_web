import { Route, Routes } from 'react-router-dom';
import { ROUTER } from '../enums/router/router';
import AdminLayout from '../layouts/adminLayout/AdminLayout';
import { AdminDashboard } from '../pages/admin/dashboard/Dashboard';
import AdminSubject from '../pages/admin/subject/Subject';
import AdminDiscipline from '../pages/admin/discipline/Discipline';
import AdminTeacher from '../pages/admin/teacher/Teacher';
import ClientLogin from '../pages/auth/clientLogin/ClientLogin';
import AdminLogin from '../pages/auth/adminLogin/AdminLogin';
import ClientLayout from '../layouts/clientLayout/ClientLayout';
import HomePage from '../pages/client/homepage/HomePage';
import Administration from '../pages/admin/administration/Administration';
import AdminExam from '../pages/admin/exam/Exam';
import AdminDocument from '../pages/admin/document/Document';
import ExamPage from '../pages/client/exam/ExamPage';
import NotFoundPage from '../pages/notFoundPage/NotFoundPage';
import ExamDetail from '../pages/client/examDetail/ExamDetail';
import NewPage from '../pages/client/news/NewPage';
import Documentpage from '../pages/client/\bdocument/Documentpage';

const arrRoutes = [
  { path: ROUTER.LOGIN, element: <ClientLogin /> },
  {
    path: ROUTER.ADMIN_LOGIN,
    element: <AdminLogin />,
  },
  {
    path: ROUTER.ADMIN,
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: ROUTER.ADMIN_SUBJECT,
        element: <AdminSubject />,
      },
      {
        path: ROUTER.ADMIN_TEACHER,
        element: <AdminTeacher />,
      },
      {
        path: ROUTER.ADMIN_DISCIPLINE,
        element: <AdminDiscipline />,
      },
      {
        path: ROUTER.ADMIN_EXAM,
        element: <AdminExam />,
      },
      {
        path: ROUTER.ADMIN_ADMINISTRATION,
        element: <Administration />,
      },
      {
        path: ROUTER.ADMIN_DOCUMENT,
        element: <AdminDocument />,
      },
    ],
  },
  {
    path: ROUTER.HOMEPAGE,
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTER.EXAM_PAGE,
        element: <ExamPage />,
      },
      {
        path: ROUTER.EXAM_DETAIL_PAGE,
        element: <ExamDetail />,
      },
      {
        path: ROUTER.NEW_PAGE,
        element: <NewPage />,
      },
      {
        path: ROUTER.DOCUMENT_PAGE,
        element: <Documentpage />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export const MainRouter = () => {
  const renderRoutes = (arrRoutes: any) => {
    return arrRoutes.map((item: any, index: number) => {
      const { path, element } = item;
      return (
        <Route key={index} path={path} element={element}>
          {item?.children?.map((it: any, id: number) => {
            return <Route key={`child-router-${id}`} {...it} />;
          }) || <></>}
        </Route>
      );
    });
  };

  return <Routes>{renderRoutes(arrRoutes)}</Routes>;
};
