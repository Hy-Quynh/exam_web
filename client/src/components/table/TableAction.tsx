import { Button, Popconfirm, Space } from 'antd';

type TableActionProps = {
  disableDelete?: boolean;
  disableUpdate?: boolean;
  handleUpdate?: () => void;
  handleDelete?: () => void;
  updateText?: string;
};

const TableAction = ({
  disableDelete,
  disableUpdate,
  handleUpdate,
  handleDelete,
  updateText
}: TableActionProps) => {
  return (
    <Space size='middle'>
      <Button
        type='primary'
        className='bg-primary'
        disabled={disableUpdate}
        onClick={() => handleUpdate?.()}
      >
        {updateText || 'Sửa'}
      </Button>
      <Popconfirm
        title='Xoá dữ liệu'
        description='Bạn có chắc chắn muốn xoá dữ liệu này?'
        okText='Đồng ý'
        cancelText='Huỷ'
        okButtonProps={{
          className: 'bg-primary',
          onClick: () => handleDelete?.()
        }}
      >
        <Button type='primary' danger disabled={disableDelete} >
          Xoá
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default TableAction;
