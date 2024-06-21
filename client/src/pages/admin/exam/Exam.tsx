import React, { useEffect, useRef, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Row,
  Select,
  Switch,
  Table,
  Typography,
  message,
} from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import { displayDate } from '../../../utils/datetime';
import { ModalControlType } from '../../../types/modal';
import { LOGIN_KEY, TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import ControlExamModal from './components/ControlExamModal';
import { examAPI } from '../../../services/exams';
import { parseJSON } from '../../../utils/handleData';
import { LOGIN_TYPE } from '../../../enums';
import { subjectAPI } from '../../../services/subjects';
import { disciplineAPI } from '../../../services/disciplines';
import { SubjectType } from '../subject/Subject';

export interface ExamType {
  _id: string;
  index: number;
  name: string;
  disciplineName: string;
  disciplineId: string;
  questionData: any;
  description: string;
  adminId: string;
  status: boolean;
  createdAt: string;
  chapterId: string;
  isReverse: boolean;
  reverseAnswer: boolean;
  disciplineChapters: { _id: string; name: string }[];
}

const AdminExam: React.FC = () => {
  const [examList, setExamList] = useState<ExamType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<ExamType>();
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [disciplineList, setDisciplineList] = useState<any>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');
  const [chapterList, setChapterList] = useState<any>([]);
  const [currentChapter, setCurrentChapter] = useState<string>('');

  const controlModalType = useRef<ModalControlType>('');
  const customerData = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const columns: TableProps<ExamType>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên đề',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'disciplineName',
      key: 'disciplineName',
    },
    {
      title: 'Chương',
      dataIndex: 'disciplineChapters',
      key: 'disciplineChapters',
      render: (_, record: any) => <div>{renderChapter(record)}</div>,
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'questionNumber',
      key: 'questionNumber',
      render: (_, record: any) => <div>{record?.questionData?.length}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record)}</div>,
    },
    {
      title: 'Đảo câu hỏi',
      dataIndex: 'isReverse',
      key: 'isReverse',
      render: (_, record) => (
        <Switch
          checked={record?.isReverse}
          onChange={(checked) => handleChangeReverse(record?._id, checked)}
        />
      ),
    },
    {
      title: 'Đảo đáp án',
      dataIndex: 'reverseAnswer',
      key: 'reverseAnswer',
      render: (_, record) => (
        <Switch
          checked={record?.reverseAnswer}
          onChange={(checked) =>
            handleChangeReverseAnswer(record?._id, checked)
          }
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record?.status}
          onChange={(checked) => handleChangeStatus(record?._id, checked)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <TableAction
          key={record?._id}
          handleUpdate={() => {
            controlModalType.current = 'UPDATE';
            setModalInitData(record);
            setOpenControlModal(true);
          }}
          handleDelete={() => handleDelete(record?._id)}
          updateText={customerData.type === LOGIN_TYPE.ADMIN ? 'Xem' : 'Sửa'}
        />
      ),
    },
  ];

  const renderChapter = (record: any) => {
    const chapterIndex = record?.disciplineChapters?.findIndex(
      (it: any) => it?._id === record?.chapterId
    );

    return `Chương ${chapterIndex + 1}: ${
      record?.disciplineChapters?.[chapterIndex]?.name
    }`;
  };

  const getSubjectList = async () => {
    try {
      const res = await subjectAPI.getAllSubject(
        undefined,
        undefined,
        undefined,
        true
      );

      if (res?.data?.success) {
        const subject = res?.data?.payload?.subject;
        setSubjectList(subject);

        if (subject?.length) {
          setCurrentSubject(subject?.[0]?._id);
          return subject?.[0]?._id;
        }
      }
      return '';
    } catch (error) {
      console.log('get subject list error >>> ', error);
      return '';
    }
  };

  const getDisciplineList = async (subject: string) => {
    try {
      const res = await disciplineAPI.getAllDiscipline(
        undefined,
        undefined,
        '',
        subject,
        true
      );

      if (res?.data?.success) {
        const disciptline = res?.data?.payload?.discipline;
        setDisciplineList(disciptline);

        if (disciptline?.length) {
          const chapters = disciptline?.find(
            (it: any) => it?._id === disciptline?.[0]?._id
          )?.chapters;
          setChapterList(chapters);
        }
      }
    } catch (error) {
      console.log('get discipline list error >>> ', error);
    }
  };

  const getExamList = async (
    subject?: string,
    discipline?: string,
    chapter?: string
  ) => {
    try {
      const res = await examAPI.getAllExam(
        undefined,
        undefined,
        undefined,
        discipline,
        subject,
        chapter,
        customerData.type === LOGIN_TYPE.TEACHER
          ? customerData.username
          : undefined
      );

      if (res?.data?.success) {
        setExamList(res?.data?.payload?.exam);
      } else {
        message.error('Lấy thông tin bộ đề thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin bộ đề thất bại');
      console.log('get exam list error >>> ', error);
    }
  };

  useEffect(() => {
    (async () => {
      const subject = await getSubjectList();
      await getDisciplineList(subject)
      await getExamList(subject);
    })();
  }, []);

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleOpenControlModal = (type: ModalControlType) => {
    setModalInitData(undefined);
    controlModalType.current = type;
    setOpenControlModal(true);
  };

  const handleChangeStatus = async (examId: string, checked: boolean) => {
    try {
      const res = await examAPI.updateExamStatus(examId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getExamList(currentSubject, currentDiscipline, currentChapter);
      } else {
        message.error(
          res?.data?.error?.message || 'Cập nhật thông tin thất bại'
        );
      }
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
      console.log('handleChangeStatus error >> ', error);
    }
  };

  const handleDelete = async (examId: string) => {
    try {
      const res = await examAPI.deleteExam(examId);
      if (res?.data?.success) {
        message.success('Xoá bộ đề thành công');
        getExamList(currentSubject, currentDiscipline, currentChapter);
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá bộ đề thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  const handleChangeReverse = async (examId: string, checked: boolean) => {
    try {
      const res = await examAPI.updateExamReverse(examId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật đảo đề thành công');
        getExamList(currentSubject, currentDiscipline, currentChapter);
      } else {
        message.error(
          res?.data?.error?.message || 'Cập nhật thông tin thất bại'
        );
      }
    } catch (error) {
      message.error('Cập nhật đảo đề thất bại');
      console.log('handleChangeReverse error >> ', error);
    }
  };

  const handleChangeReverseAnswer = async (
    examId: string,
    checked: boolean
  ) => {
    try {
      const res = await examAPI.updateExamReverseAnswer(examId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật đảo đề thành công');
        getExamList(currentSubject, currentDiscipline, currentChapter);
      } else {
        message.error(
          res?.data?.error?.message || 'Cập nhật thông tin thất bại'
        );
      }
    } catch (error) {
      message.error('Cập nhật đảo đề thất bại');
      console.log('handleChangeReverse error >> ', error);
    }
  };

  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Admin',
            },
            {
              title: 'Bộ đề',
            },
          ]}
        />
      </div>
      <Row wrap={true} justify={'start'} className='mb-[10px] mt-[10px]'>
        <div className='flex flex-start items-center gap-[16px] w-[100%] flex-wrap'>
          <div className='flex items-center gap-[8px]'>
            <Typography.Paragraph className='text-sm mt-[10px]'>
              Bộ môn:{' '}
            </Typography.Paragraph>
            <Select
              style={{ width: 200 }}
              options={subjectList?.map((item) => {
                return {
                  value: item?._id,
                  label: item?.name,
                };
              })}
              value={currentSubject}
              onChange={async (value) => {
                setCurrentDiscipline('');
                setCurrentChapter('');
                setCurrentSubject(value);
                await getDisciplineList(value);
                getExamList(value, '', '');
              }}
            />
          </div>

          <div className='flex items-center gap-[8px]'>
            <Typography.Paragraph className='text-sm mt-[10px]'>
              Môn học:{' '}
            </Typography.Paragraph>
            <Select
              style={{ width: 200 }}
              options={disciplineList?.map((item: any) => {
                return {
                  value: item?._id,
                  label: item?.name,
                };
              })}
              value={currentDiscipline}
              onChange={(value) => {
                setCurrentChapter('');
                setChapterList(
                  disciplineList?.find((it: any) => it?._id === value)?.chapters
                );
                setCurrentDiscipline(value);
                getExamList(currentSubject, value, '');
              }}
            />
          </div>

          <div className='flex items-center gap-[8px]'>
            <Typography.Paragraph className='text-sm mt-[10px]'>
              Chương:{' '}
            </Typography.Paragraph>
            <Select
              style={{ width: 200 }}
              options={chapterList?.map((item: any) => {
                return {
                  value: item?._id,
                  label: item?.name,
                };
              })}
              value={currentChapter}
              onChange={(value) => {
                setCurrentChapter(value);
                getExamList(currentSubject, currentDiscipline, value);
              }}
            />
          </div>
        </div>
      </Row>

      <div className='flex justify-end mb-[20px]'>
        <Button
          type='primary'
          className='bg-primary'
          onClick={() => handleOpenControlModal('CREATE')}
          disabled={customerData.type === LOGIN_TYPE.ADMIN}
        >
          Thêm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={examList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlExamModal
          title={
            controlModalType.current === 'CREATE'
              ? 'Thêm mới'
              : controlModalType.current === 'UPDATE'
              ? 'Cập nhật'
              : 'Xem chi tiết'
          }
          isOpen={openControlModal}
          handleCancel={() => handleCancelControlModal()}
          type={controlModalType.current}
          initData={modalInitData}
          reloadData={() => {
            setOpenControlModal(false);
            getExamList(currentSubject, currentDiscipline, currentChapter);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminExam;
