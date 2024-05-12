import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import { displayDate } from '../../../utils/datetime';
import { ModalControlType } from '../../../types/modal';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import { examKitAPI } from '../../../services/exam-kit';
import { ExamKitQuestionStructure } from '../../../types/examKit';
import ControlExamKitModal from './components/ControlExamKitModal';

export interface ExamKitType {
  _id: string;
  index: number;
  name: string;
  disciplineId: string;
  status: boolean;
  isDelete: boolean;
  testTime: number;
  totalQuestion: number;
  examStructure: ExamKitQuestionStructure[];
  isReverse: boolean;
  createdAt: string;
  updatedAt: string;
  disciplineName: string;
  description: string;
  disciplineChapters: { _id: string; name: string }[];
  questionData?: any
}

const AdminExamKit: React.FC = () => {
  const [examKitList, setExamKitList] = useState<ExamKitType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<ExamKitType>();
  const controlModalType = useRef<ModalControlType>('');

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
    },
    {
      title: 'Thời gian làm bài',
      dataIndex: 'testTime',
      key: 'testTime',
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
          onChange={(checked) => handleChangeReverse(record?._id, checked)}
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

  const getExamKitList = async () => {
    try {
      const res = await examKitAPI.getAllExamKit();

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
    getExamKitList();
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
        getExamKitList();
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
        getExamKitList();
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
            getExamKitList();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminExamKit;
