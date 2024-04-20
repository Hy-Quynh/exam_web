import { Form, Input, message } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { ModalControlType } from '../../../../types/modal';
import { subjectAPI } from '../../../../services/subjects';
import { SubjectType } from '../Subject';
import { SubjectDataType } from '../../../../types/subject';

type ControlSubjectProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  title: string;
  type: ModalControlType;
  initData?: SubjectType;
};

const ControlSubjecModal: React.FC<ControlSubjectProps> = (props) => {
  const [form] = Form.useForm();

  const submitForm = async () => {
    try {
      await form.validateFields();
      if (props.type === 'CREATE') {
        await handleAddSubject();
      }

      if (props.type === 'UPDATE') {
        await hanldleUpdateSubjectInfo();
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  const handleAddSubject = async () => {
    try {
      const formData = form.getFieldsValue();
      const subjectData: SubjectDataType = {
        name: formData?.name,
      };

      const res = await subjectAPI.addNewSubject(subjectData);
      if (res?.data?.success) {
        message.success('Thêm thông tin bộ môn thành công');
        props?.reloadData();
      } else {
        message.error(
          res?.data?.error?.message || 'Thêm thông tin bộ môn thất bại'
        );
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const hanldleUpdateSubjectInfo = async () => {
    try {
      if (props?.initData?._id) {
        const formData = form.getFieldsValue();
        const subjectData: SubjectDataType = {
          name: formData?.name,
        };

        const res = await subjectAPI.updateSubject(
          props?.initData?._id,
          subjectData
        );

        if (res?.data?.success) {
          message.success('Cập nhật thông tin bộ môn thành công');
          props?.reloadData();
        } else {
          message.error(
            res?.data?.error?.message || 'Cập nhật thông tin bộ môn thất bại'
          );
        }
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <CustomModal
      isOpen={props?.isOpen}
      handCanel={() => props?.handleCancel()}
      title={props.title}
      handleSubmit={() => submitForm()}
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{
          name: props?.initData?.name,
        }}
      >
        <Form.Item
          label='Tên bộ môn'
          rules={[{ required: true, message: 'Vui lòng nhập thông tin tên' }]}
          name='name'
        >
          <Input placeholder='Nhập vào tên bộ môn' />
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default ControlSubjecModal;
