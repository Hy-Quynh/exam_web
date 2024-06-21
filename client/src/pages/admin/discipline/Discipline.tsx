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
import { disciplineAPI } from '../../../services/disciplines';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import ControlDisciplineModal from './components/ControlDisciplineModal';
import { subjectAPI } from '../../../services/subjects';
import { SubjectType } from '../subject/Subject';

export interface DisciplineType {
  _id: string;
  index: number;
  name: string;
  subjectName: string;
  subjectId: string;
  chapters: { name: string }[];
  adminId: string;
  status: boolean;
  createdAt: string;
}

const AdminDiscipline: React.FC = () => {
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<DisciplineType>();
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const controlModalType = useRef<ModalControlType>('');

  const columns: TableProps<DisciplineType>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tên bộ môn',
      dataIndex: 'subjectName',
      key: 'subjectName',
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
      const res = await subjectAPI.getAllSubject(
        undefined,
        undefined,
        undefined,
        true
      );

      if (res?.data?.success) {
        setSubjectList(res?.data?.payload?.subject);
      }
    } catch (error) {
      console.log('get subject list error >>> ', error);
    }
  };

  const getDisciplineList = async (subject?: string) => {
    try {
      const res = await disciplineAPI.getAllDiscipline(
        undefined,
        undefined,
        undefined,
        subject
      );

      if (res?.data?.success) {
        setDisciplineList(res?.data?.payload?.discipline);
      } else {
        message.error('Lấy thông tin môn học thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin môn học thất bại');
      console.log('get discipline list error >>> ', error);
    }
  };

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleOpenControlModal = (type: ModalControlType) => {
    setModalInitData(undefined);
    controlModalType.current = type;
    setOpenControlModal(true);
  };

  const handleChangeStatus = async (disciplineId: string, checked: boolean) => {
    try {
      const res = await disciplineAPI.updateDisciplineStatus(
        disciplineId,
        checked
      );
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getDisciplineList(currentSubject);
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

  const handleDelete = async (disciplineId: string) => {
    try {
      const res = await disciplineAPI.deleteDiscipline(disciplineId);
      if (res?.data?.success) {
        message.success('Xoá môn học thành công');
        getDisciplineList(currentSubject);
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá môn học thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  useEffect(() => {
    (async() => {
      await getSubjectList();
      await getDisciplineList();
    })()
  }, []);

  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Admin',
            },
            {
              title: 'Môn học',
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
                setCurrentSubject(value);
                getDisciplineList(value);
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
        >
          Thêm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={disciplineList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlDisciplineModal
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
            getDisciplineList(currentSubject);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminDiscipline;
