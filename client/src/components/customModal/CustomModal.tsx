import React, { useState } from 'react';
import { Modal } from 'antd';

type CustomModalProps = {
  title?: string;
  okText?: string;
  cancelText?: string;
  isOpen: boolean;
  handleSubmit?: () => Promise<void>;
  handCanel: () => void;
  children?: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = (props) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmit(true);
    await props?.handleSubmit?.();
    setIsSubmit(false);
  };

  return (
    <Modal
      title={props.title}
      open={props?.isOpen}
      onOk={() => handleSubmit()}
      onCancel={() => props.handCanel()}
      okText={props.okText || 'Lưu'}
      cancelText={props?.cancelText || 'Huỷ'}
      okButtonProps={{ className: 'bg-primary', loading: isSubmit }}
      maskClosable={false}
    >
      {props?.children}
    </Modal>
  );
};

export default CustomModal;
