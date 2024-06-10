import { Route, Routes } from 'react-router-dom';
import { ROUTER } from '../enums/router/router';
import { AdminDashboard } from '../pages/admin/dashboard/Dashboard';
import AdminSubject from '../pages/admin/subject/Subject';
import AdminDiscipline from '../pages/admin/discipline/Discipline';
import AdminTeacher from '../pages/admin/teacher/Teacher';
import ClientLogin from '../pages/auth/clientLogin/ClientLogin';
import AdminLogin from '../pages/auth/adminLogin/AdminLogin';
import HomePage from '../pages/client/homepage/HomePage';
import Administration from '../pages/admin/administration/Administration';
import AdminExam from '../pages/admin/exam/Exam';
import AdminDocument from '../pages/admin/document/Document';
import ExamPage from '../pages/client/exam/ExamPage';
import NotFoundPage from '../pages/notFoundPage/NotFoundPage';
import ExamDetail from '../pages/client/examDetail/ExamDetail';
import NewPage from '../pages/client/news/NewPage';
import Documentpage from '../pages/client/document/DocumentPage';
import AdminExamKit from '../pages/admin/exam-kit/ExamKit';
import DocumentDetail from '../pages/client/documentDetail/DocumentDetail';
import HistoryInfo from '../pages/client/historyInfo';
import DocumentHistory from '../pages/admin/document-history/DocumentHistory';
import ExamHistory from '../pages/admin/exam-history/ExamHistory';
import AdminPrivate from '../layouts/adminLayout/PrivateLayout';
import ClientLayout from '../layouts/clientLayout/ClientLayout';
import PrivateClientLayout from '../layouts/clientLayout/MainClientLayout';

const arrRoutes = [
  { path: ROUTER.LOGIN, element: <ClientLogin /> },
  {
    path: ROUTER.ADMIN_LOGIN,
    element: <AdminLogin />,
  },
  {
    path: ROUTER.ADMIN,
    element: <AdminPrivate />,
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
        path: ROUTER.ADMIN_EXAM_KIT,
        element: <AdminExamKit />,
      },
      {
        path: ROUTER.ADMIN_ADMINISTRATION,
        element: <Administration />,
      },
      {
        path: ROUTER.ADMIN_DOCUMENT,
        element: <AdminDocument />,
      },
      {
        path: ROUTER.ADMIN_DOCUMENT_HISTORY,
        element: <DocumentHistory />,
      },
      {
        path: ROUTER.ADMIN_EXAM_HISTORY,
        element: <ExamHistory />,
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
        element: (
          <PrivateClientLayout>
            <ExamPage />
          </PrivateClientLayout>
        ),
      },
      {
        path: ROUTER.EXAM_DETAIL_PAGE,
        element: (
          <PrivateClientLayout>
            <ExamDetail />
          </PrivateClientLayout>
        ),
      },
      {
        path: ROUTER.NEW_PAGE,
        element: <NewPage />,
      },
      {
        path: ROUTER.DOCUMENT_PAGE,
        element: (
          <PrivateClientLayout>
            <Documentpage />
          </PrivateClientLayout>
        ),
      },
      {
        path: ROUTER.DOCUMENT_DETAIl_PAGE,
        element: (
          <PrivateClientLayout>
            <DocumentDetail />
          </PrivateClientLayout>
        ),
      },
      {
        path: ROUTER.STUDENT_INFO,
        element: (
          <PrivateClientLayout>
            <HistoryInfo />
          </PrivateClientLayout>
        ),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
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
