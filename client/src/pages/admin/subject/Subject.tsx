import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import { displayDate } from '../../../utils/datetime';
import { subjectAPI } from '../../../services/subjects';
import { ModalControlType } from '../../../types/modal';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import ControlSubjecModal from './components/ControlSubjectModal';

export interface SubjectType {
  _id: string;
  index: number;
  name: string;
  adminId: string;
  status: boolean;
  createdAt: string;
}

const SubjectSubject: React.FC = () => {
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<SubjectType>();
  const controlModalType = useRef<ModalControlType>('');

  const columns: TableProps<SubjectType>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên bộ môn',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record?.createdAt)}</div>,
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

  const getSubjectList = async () => {
    try {
      const res = await subjectAPI.getAllSubject();

      if (res?.data?.success) {
        setSubjectList(res?.data?.payload?.subject);
      } else {
        message.error('Lấy thông tin bộ môn thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin bộ môn thất bại');
      console.log('get subject list error >>> ', error);
    }
  };

  useEffect(() => {
    getSubjectList();
  }, []);

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleOpenControlModal = (type: ModalControlType) => {
    setModalInitData(undefined);
    controlModalType.current = type;
    setOpenControlModal(true);
  };

  const handleChangeStatus = async (subjectId: string, checked: boolean) => {
    try {
      const res = await subjectAPI.updateSubjectStatus(subjectId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getSubjectList();
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

  const handleDelete = async (subjectId: string) => {
    try {
      const res = await subjectAPI.deleteSubject(subjectId);
      if (res?.data?.success) {
        message.success('Xoá bộ môn thành công');
        getSubjectList();
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá bộ môn thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Subject',
            },
            {
              title: 'Bộ môn',
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
        dataSource={subjectList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlSubjecModal
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
            getSubjectList();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubjectSubject;
