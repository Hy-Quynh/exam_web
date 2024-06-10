import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import ControlAdministration from './components/ControlAdministration';
import { ModalControlType } from '../../../types/modal';
import { adminAPI } from '../../../services/admins';
import { displayDate } from '../../../utils/datetime';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';

export interface AdminData {
  _id: string;
  index: number;
  name: string;
  userName: string;
  status: boolean;
  createdAt: string;
  mainAdmin: boolean;
}

const Administration: React.FC = () => {
  const [adminList, setAdminList] = useState<AdminData[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<AdminData>();
  const controlModalType = useRef<ModalControlType>('');

  const columns: TableProps<AdminData>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên quản trị',
      dataIndex: 'name',
      key: 'name',
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
          disabled={record?.mainAdmin}
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
          disableDelete={record?.mainAdmin}
          disableUpdate={record?.mainAdmin}
        />
      ),
    },
  ];

  const getAdminList = async () => {
    try {
      const res = await adminAPI.getAdminList();

      if (res?.data?.success) {
        setAdminList(res?.data?.payload?.admin);
      } else {
        message.error('Lấy thông tin quản trị viên thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin quản trị viên thất bại');
      console.log('get admin list error >>> ', error);
    }
  };

  useEffect(() => {
    getAdminList();
  }, []);

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleOpenControlModal = (type: ModalControlType) => {
    setModalInitData(undefined);
    controlModalType.current = type;
    setOpenControlModal(true);
  };

  const handleChangeStatus = async (adminId: string, checked: boolean) => {
    try {
      const res = await adminAPI.updateAdminStatus(adminId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getAdminList();
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

  const handleDelete = async (adminId: string) => {
    try {
      const res = await adminAPI.deleteAdmin(adminId);
      if (res?.data?.success) {
        message.success('Xoá quản trị viên thành công');
        getAdminList();
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá quản trị viên thất bại');
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
              title: 'Quản trị viên',
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
        dataSource={adminList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlAdministration
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
            getAdminList();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Administration;
