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
import { examKitAPI } from '../../../services/exam-kit';
import { ExamKitQuestionStructure } from '../../../types/examKit';
import ControlExamKitModal from './components/ControlExamKitModal';
import { parseJSON } from '../../../utils/handleData';
import { LOGIN_TYPE } from '../../../enums';
import { subjectAPI } from '../../../services/subjects';
import { disciplineAPI } from '../../../services/disciplines';
import { SubjectType } from '../subject/Subject';
import { DisciplineType } from '../discipline/Discipline';

export interface ExamKitType {
  _id: string;
  index: number;
  name: string;
  disciplineId: string;
  status: boolean;
  isDelete: boolean;
  testTime: number;
  examStructure: ExamKitQuestionStructure[];
  isReverse: boolean;
  createdAt: string;
  updatedAt: string;
  disciplineName: string;
  description: string;
  reverseAnswer: boolean;
  disciplineChapters: { _id: string; name: string }[];
  questionData?: any;
  year: number;
  startTime: string;
  openExamStatus: boolean;
}

const AdminExamKit: React.FC = () => {
  const [examKitList, setExamKitList] = useState<ExamKitType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<ExamKitType>();
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [currentDiscipline, setCurrentDiscipline] = useState<string>('');

  const controlModalType = useRef<ModalControlType>('');
  const customerData = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const columns: TableProps<ExamKitType>['columns'] = [
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
      title: 'Môn học',
      dataIndex: 'disciplineName',
      key: 'disciplineName',
    },
    {
      title: 'Tổng câu hỏi',
      dataIndex: 'totalQuestion',
      key: 'totalQuestion',
      render: (_, record: any) => (
        <div>
          {record?.examStructure?.reduce(
            (pre: number, curr: ExamKitQuestionStructure) =>
              pre + curr.numberQuestion,
            0
          )}
        </div>
      ),
    },
    {
      title: 'Thời gian làm bài',
      dataIndex: 'testTime',
      key: 'testTime',
      render: (_, record: any) => <div>{record?.testTime}p</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record?.createdAt)}</div>,
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
    // {
    //   title: 'Đảo đề',
    //   dataIndex: 'isReverse',
    //   key: 'isReverse',
    //   render: (_, record) => (
    //     <Switch
    //       checked={record?.isReverse}
    //       onChange={(checked) => handleChangeReverse(record?._id, checked)}
    //     />
    //   ),
    // },
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
        undefined,
        subject,
        true
      );

      if (res?.data?.success) {
        const discipline = res?.data?.payload?.discipline;
        setDisciplineList(discipline);
      }
    } catch (error) {
      console.log('get exam list error >>> ', error);
    }
  };

  const getExamKitList = async (discipline?: string, subject?: string) => {
    try {
      const res = await examKitAPI.getAllExamKit(
        undefined,
        undefined,
        undefined,
        discipline,
        customerData.type === LOGIN_TYPE.TEACHER
          ? customerData.username
          : undefined,
        undefined,
        subject
      );

      if (res?.data?.success) {
        setExamKitList(res?.data?.payload?.examKit);
      } else {
        message.error('Lấy thông tin bộ đề kiểm tra thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin bộ đề kiểm tra thất bại');
      console.log('get exam kit list error >>> ', error);
    }
  };

  useEffect(() => {
    (async () => {
      const subject = await getSubjectList();
      await getDisciplineList(subject);
      await getExamKitList(undefined, subject);
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

  const handleChangeStatus = async (examKitId: string, checked: boolean) => {
    try {
      const res = await examKitAPI.updateExamKitStatus(examKitId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getExamKitList(currentDiscipline, currentSubject);
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

  const handleChangeReverse = async (examKitId: string, checked: boolean) => {
    try {
      const res = await examKitAPI.updateExamKitReverse(examKitId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật đảo đề thành công');
        getExamKitList();
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

  const handleDelete = async (examKitId: string) => {
    try {
      const res = await examKitAPI.deleteExamKit(examKitId);
      if (res?.data?.success) {
        message.success('Xoá đề kiểm tra thành công');
        getExamKitList(currentDiscipline, currentSubject);
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá đề kiểm tra thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  const handleChangeReverseAnswer = async (
    examKitId: string,
    checked: boolean
  ) => {
    try {
      const res = await examKitAPI.updateExamKitReverseAnswer(
        examKitId,
        checked
      );
      if (res?.data?.success) {
        message.success('Cập nhật đảo đề thành công');
        getExamKitList(currentDiscipline, currentSubject);
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
              title: 'Đề kiểm tra',
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
                setCurrentSubject(value);
                await getDisciplineList(value);
                getExamKitList('', value);
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
                setCurrentDiscipline(value);
                getExamKitList(value, '');
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
        dataSource={examKitList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlExamKitModal
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
            getExamKitList(currentDiscipline, currentSubject);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminExamKit;
