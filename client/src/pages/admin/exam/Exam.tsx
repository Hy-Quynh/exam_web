import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import { displayDate } from '../../../utils/datetime';
import { ModalControlType } from '../../../types/modal';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import ControlExamModal from './components/ControlExamModal';
import { examAPI } from '../../../services/exams';

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
  disciplineChapters: {_id: string, name: string}[]
}

const AdminExam: React.FC = () => {
  const [examList, setExamList] = useState<ExamType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<ExamType>();
  const controlModalType = useRef<ModalControlType>('');

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
      title: 'Đảo đề',
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
          onChange={(checked) => handleChangeReverseAnswer(record?._id, checked)}
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
        />
      ),
    },
  ];

  const renderChapter = (record: any) => {
    const chapterIndex = record?.disciplineChapters?.findIndex((it: any) => it?._id === record?.chapterId)

    return `Chương ${chapterIndex + 1}: ${record?.disciplineChapters?.[chapterIndex]?.name}`
    
  }

  const getExamList = async () => {
    try {
      const res = await examAPI.getAllExam();

      if (res?.data?.success) {
        setExamList(res?.data?.payload?.exam);
      } else {
        message.error('Lấy thông tin tài liệu thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin tài liệu thất bại');
      console.log('get exam list error >>> ', error);
    }
  };

  useEffect(() => {
    getExamList();
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
        getExamList();
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
        message.success('Xoá tài liệu thành công');
        getExamList();
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá tài liệu thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  const handleChangeReverse = async (examId: string, checked: boolean) => {
    try {
      const res = await examAPI.updateExamReverse(examId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật đảo đề thành công');
        getExamList();
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

  const handleChangeReverseAnswer = async (examId: string, checked: boolean) => {
    try {
      const res = await examAPI.updateExamReverseAnswer(examId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật đảo đề thành công');
        getExamList();
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
              title: 'Tài liệu',
            },
          ]}
        />
      </div>
      <div className='flex justify-end mb-[20px]'>
        <Button
          type='primary'
          className='bg-primary'
          onClick={() => handleOpenControlModal('CREATE')}
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
            getExamList();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminExam;
