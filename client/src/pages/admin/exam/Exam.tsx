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
  testTime: number;
  description: string;
  adminId: string;
  status: boolean;
  isReverse: boolean;
  createdAt: string;
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record)}</div>,
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
      title: 'Đảo đề',
      dataIndex: 'isReverse',
      key: 'isReverse',
      render: (_, record) => (
        <Switch
          checked={record?.isReverse}
          onChange={(reverse) => handleChangeReverse(record?._id, reverse)}
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

  const getExamList = async () => {
    try {
      const res = await examAPI.getAllExam();

      if (res?.data?.success) {
        setExamList(res?.data?.payload?.exam);
      } else {
        message.error('Lấy thông tin đề kiểm tra thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin đề kiểm tra thất bại');
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

  const handleChangeReverse = async (examId: string, reverse: boolean) => {
    try {
      const res = await examAPI.updateExamReverse(examId, reverse);
      if (res?.data?.success) {
        message.success('Cập nhật thông tin thành công');
        getExamList();
      } else {
        message.error(
          res?.data?.error?.message || 'Cập nhật thông tin thất bại'
        );
      }
    } catch (error) {
      message.error('Cập nhật thông tin thất bại');
      console.log('handleChangeReverse error >> ', error);
    }
  };

  const handleDelete = async (examId: string) => {
    try {
      const res = await examAPI.deleteExam(examId);
      if (res?.data?.success) {
        message.success('Xoá đề kiểm tra thành công');
        getExamList();
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá đề kiểm tra thất bại');
      console.log('handleDelete error >> ', error);
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
