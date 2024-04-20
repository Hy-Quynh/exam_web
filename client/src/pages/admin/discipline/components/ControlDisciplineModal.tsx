import { Form, Input, Select, message } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { ModalControlType } from '../../../../types/modal';
import { disciplineAPI } from '../../../../services/disciplines';
import { DisciplineType } from '../Discipline';
import { DisciplineDataType } from '../../../../types/discipline';
import { useEffect, useState } from 'react';
import { SubjectType } from '../../subject/Subject';
import { subjectAPI } from '../../../../services/subjects';

type ControlDisciplineProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  title: string;
  type: ModalControlType;
  initData?: DisciplineType;
};

const ControlDisciplineModal: React.FC<ControlDisciplineProps> = (props) => {
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [form] = Form.useForm();

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

  const submitForm = async () => {
    try {
      await form.validateFields();
      if (props.type === 'CREATE') {
        await handleAddDiscipline();
      }

      if (props.type === 'UPDATE') {
        await hanldleUpdateDiscipline();
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  const handleAddDiscipline = async () => {
    try {
      const formData = form.getFieldsValue();
      const disciplineData: DisciplineDataType = {
        name: formData?.name,
        subjectId: formData?.subjectId,
      };

      const res = await disciplineAPI.addNewDiscipline(disciplineData);
      if (res?.data?.success) {
        message.success('Thêm thông tin môn học thành công');
        props?.reloadData();
      } else {
        message.error(
          res?.data?.error?.message || 'Thêm thông tin môn học thất bại'
        );
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const hanldleUpdateDiscipline = async () => {
    try {
      if (props?.initData?._id) {
        const formData = form.getFieldsValue();
        const disciplineData: DisciplineDataType = {
          name: formData?.name,
          subjectId: formData?.subjectId,
        };

        const res = await disciplineAPI.updateDiscipline(
          props?.initData?._id,
          disciplineData
        );

        if (res?.data?.success) {
          message.success('Cập nhật thông tin môn học thành công');
          props?.reloadData();
        } else {
          message.error(
            res?.data?.error?.message || 'Cập nhật thông tin môn học thất bại'
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
          subjectId: props?.initData?.subjectId
        }}
      >
        <Form.Item
          label='Tên môn học'
          rules={[{ required: true, message: 'Vui lòng nhập thông tin tên' }]}
          name='name'
        >
          <Input placeholder='Nhập vào tên môn học' />
        </Form.Item>
        <Form.Item label='Bộ môn' name='subjectId'>
          <Select>
            {subjectList?.map((item) => {
              return (
                <Select.Option value={item?._id} key={item?._id}>
                  {item?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default ControlDisciplineModal;
