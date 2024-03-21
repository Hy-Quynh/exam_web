import { Button, Popconfirm, Space } from "antd";

const TableAction = () => {
  return (
    <Space size='middle'>
      <Button type='primary' className='bg-primary'>
        Sửa
      </Button>
      <Popconfirm
        title='Xoá dữ liệu'
        description='Bạn có chắc chắn muốn xoá dữ liệu này?'
        okText='Đồng ý'
        cancelText='Huỷ'
        okButtonProps={{
          className: 'bg-primary',
        }}
      >
        <Button type='primary' danger>
          Xoá
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default TableAction;
