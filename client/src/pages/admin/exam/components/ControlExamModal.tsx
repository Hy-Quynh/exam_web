import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Select,
  Typography,
  message,
} from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { ModalControlType } from '../../../../types/modal';
import { useEffect, useState } from 'react';
import { examAPI } from '../../../../services/exams';
import { CloseOutlined } from '@ant-design/icons';
import './../style.scss';
import { ExamDataType } from '../../../../types/exam';
import { DisciplineType } from '../../discipline/Discipline';
import { ExamType } from '../Exam';
import { disciplineAPI } from '../../../../services/disciplines';

type ControlExamProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  title: string;
  type: ModalControlType;
  initData?: ExamType;
};

const { TextArea } = Input;

const ControlExamModal: React.FC<ControlExamProps> = (props) => {
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [form] = Form.useForm();

  const getDisciplineList = async () => {
    try {
      const res = await disciplineAPI.getAllDiscipline();

      if (res?.data?.success) {
        setDisciplineList(res?.data?.payload?.discipline);
      } else {
        message.error('Lấy thông tin môn học thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin môn học thất bại');
      console.log('get subject list error >>> ', error);
    }
  };

  useEffect(() => {
    getDisciplineList();
  }, []);

  const submitForm = async () => {
    try {
      await form.validateFields();
      if (props.type === 'CREATE') {
        await handleAddExam();
      }

      if (props.type === 'UPDATE') {
        await hanldleUpdateExam();
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  const handleAddExam = async () => {
    try {
      const formData = form.getFieldsValue();

      const examData: ExamDataType = {
        name: formData?.name,
        disciplineId: formData?.disciplineId,
        questionData: formData?.questionData,
        testTime: formData?.testTime,
        description: formData?.description
      };

      const res = await examAPI.addNewExam(examData);
      if (res?.data?.success) {
        message.success('Thêm thông tin đề thi thành công');
        props?.reloadData();
      } else {
        message.error(
          res?.data?.error?.message || 'Thêm thông tin đề thi thất bại'
        );
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const hanldleUpdateExam = async () => {
    try {
      if (props?.initData?._id) {
        const formData = form.getFieldsValue();
        const examData: ExamDataType = {
          name: formData?.name,
          disciplineId: formData?.disciplineId,
          questionData: formData?.questionData,
          testTime: formData?.testTime,
          description: formData?.description
        };

        const res = await examAPI.updateExam(props?.initData?._id, examData);
        if (res?.data?.success) {
          message.success('Cập nhật thông tin đề thi thành công');
          props?.reloadData();
        } else {
          message.error(
            res?.data?.error?.message || 'Cập nhật thông tin đề thi thất bại'
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
      width={'70vw'}
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{
          name: props?.initData?.name,
          disciplineId: props?.initData?.disciplineId,
          questionData: props?.initData?.questionData,
          testTime: props?.initData?.testTime,
          description: props?.initData?.description
        }}
      >
        <Form.Item
          label='Tên đề kiểm tra'
          rules={[{ required: true, message: 'Vui lòng tên đề kiểm tra' }]}
          name='name'
        >
          <Input placeholder='Nhập vào tên đề kiểm tra' />
        </Form.Item>
        <Form.Item
          label='Môn học'
          name='disciplineId'
          rules={[{ required: true, message: 'Vui lòng nhập môn học' }]}
        >
          <Select>
            {disciplineList?.map((item) => {
              return (
                <Select.Option value={item?._id} key={item?._id}>
                  {item?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='Thời gian làm bài'
          rules={[
            { required: true, message: 'Vui lòng nhập thời lượng' },
            {
              validator: async (_, times) => {
                if (times <= 0) {
                  return Promise.reject('Thời gian làm bài cần lớn hơn 0');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='testTime'
        >
          <Input
            type='number'
            placeholder='Nhập vào thời gian làm bài'
            min={1}
          />
        </Form.Item>

        <Form.Item
          label='Mô tả'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          name='description'
        >
          <TextArea rows={4} />
        </Form.Item>

        <Typography.Paragraph>Bộ câu hỏi</Typography.Paragraph>

        <Form.List
          name='questionData'
          rules={[
            {
              validator: async (_, question) => {
                if (!question?.length) {
                  return Promise.reject('Vui lòng thêm câu hỏi');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div
              style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}
            >
              {fields.map((field) => (
                <Card
                  size='small'
                  title={`Câu hỏi ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                  className='question-list-modal'
                >
                  <Form.Item
                    label='Câu hỏi'
                    name={[field.name, 'question']}
                    className='question-form-item'
                  >
                    <Input placeholder='Nhập vào câu hỏi' />
                  </Form.Item>

                  {/* Nest Form.List */}
                  <Form.Item label='Câu trả lời' className='answer-form-item'>
                    <div className='answer-list-title'>
                      <div className='answer-title'>Câu trả lời</div>

                      <div className='is-true-title'>Đáp án</div>
                    </div>
                    <Form.List
                      name={[field.name, 'answerList']}
                      rules={[
                        {
                          validator: async (_, answer) => {
                            if (!answer?.length) {
                              return Promise.reject(
                                'Vui lòng thêm câu trả lời'
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      {(subFields, subOpt, { errors }) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => (
                            <div
                              key={subField.key}
                              className='answer-item-wrap'
                            >
                              <div className='answer-item'>
                                <Form.Item
                                  noStyle
                                  name={[subField.name, 'answer']}
                                  rules={[
                                    {
                                      validator: async (_, value) => {
                                        if (!value?.length) {
                                          return Promise.reject(
                                            'Vui lòng nhập đáp án ' +
                                              (field.name + 1)
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <Input placeholder='Nhập vào câu trả lời' />
                                </Form.Item>
                              </div>
                              <div className='answer-checkbox'>
                                <Form.Item
                                  noStyle
                                  name={[subField.name, 'isTrue']}
                                  valuePropName='checked'
                                >
                                  <Checkbox />
                                </Form.Item>
                              </div>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              />
                            </div>
                          ))}
                          <Button
                            type='dashed'
                            onClick={() => subOpt.add()}
                            block
                          >
                            + Thêm câu trả lời
                          </Button>
                          <Form.ErrorList
                            errors={errors}
                            className='text-[#fc0f03]'
                          />
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <Button type='dashed' onClick={() => add()} block>
                + Thêm câu hỏi
              </Button>
              <Form.ErrorList errors={errors} className='text-[#fc0f03]' />
            </div>
          )}
        </Form.List>
      </Form>
    </CustomModal>
  );
};

export default ControlExamModal;
