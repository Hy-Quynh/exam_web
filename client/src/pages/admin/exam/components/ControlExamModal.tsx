import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Radio,
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
import CustomQuillEditor from '../../../../components/customQuillEditor';
import { AnswerTypeEnum } from '../../../../enums/exams';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY } from '../../../../constants/table';

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
  const [disciplineChapter, setDisciplineChapter] = useState<any>([]);
  const [form] = Form.useForm();
  const customerData = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  useEffect(() => {
    if (props?.initData?.disciplineId && disciplineList?.length) {
      const findDiscipline = disciplineList?.find(
        (it) => it?._id === props?.initData?.disciplineId
      );
      setDisciplineChapter(findDiscipline?.chapters);
    }
  }, [props?.initData?.disciplineId, disciplineList]);

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
        description: formData?.description,
        chapterId: formData?.chapterId,
        teacherCode: customerData?.username
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
          description: formData?.description,
          chapterId: formData?.chapterId,
          teacherCode: customerData?.username
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

  const handlChangeChapter = async (value: string) => {
    try {
      const disciplineId = form.getFieldValue('disciplineId');
      const res = await examAPI.checkExistDisciplineExamChapter(
        disciplineId,
        value
      );
      if (res?.data.payload) {
        form.setFieldValue('chapterId', props?.initData?.chapterId || '');
        message.warning('Chương này của môn học đã có đề thi');
      } else {
        form.setFieldValue('chapterId', value);
      }
    } catch (error) {
      console.log('change chapter error >> ', error);
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
          description: props?.initData?.description,
          chapterId: props?.initData?.chapterId,
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
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select
            onChange={(value) => {
              form.setFieldValue('disciplineId', value);
              const findDiscipline = disciplineList?.find(
                (it) => it?._id === value
              );
              setDisciplineChapter(findDiscipline?.chapters);
            }}
          >
            {disciplineList?.map((item: any) => {
              return (
                <Select.Option value={item?._id} key={item?._id}>
                  {item?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label='Chương'
          name='chapterId'
          rules={[{ required: true, message: 'Vui lòng chọn chương' }]}
        >
          <Select onChange={(value) => handlChangeChapter(value)}>
            {disciplineChapter?.map((item: any, index: number) => {
              return (
                <Select.Option value={item?._id} key={item?._id}>
                  {`Chương ${index + 1}: ${item?.name}`}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='Mô tả'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          name='description'
        >
          <TextArea rows={4} />
        </Form.Item>

        <Typography.Paragraph>Danh sách câu hỏi</Typography.Paragraph>

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
                    <CustomQuillEditor
                      initValue={
                        props?.initData?.questionData?.[field.name]?.question
                      }
                      handleChange={(value) => {
                        form.setFieldValue(
                          ['questionData', field.name, 'question'],
                          value
                        );
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label='Dạng trả lời'
                    name={[field.name, 'answerType']}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn một tùy chọn!',
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={(event) => {
                        const anwserList = form.getFieldValue([
                          'questionData',
                          field.name,
                          'answerList',
                        ]);
                        const updateAnwser = anwserList?.map((item: any) => {
                          return {
                            ...item,
                            isTrue: false,
                          };
                        });
                        form.setFieldValue(
                          ['questionData', field.name, 'answerList'],
                          updateAnwser
                        );
                      }}
                    >
                      <Radio value={AnswerTypeEnum.RADIO}> Một đáp án </Radio>
                      <Radio value={AnswerTypeEnum.CHECKOX}>Nhiều đáp án</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {/* Nest Form.List */}
                  <Form.Item className='answer-form-item mt-[20px]'>
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
                            
                            const filterTrue = answer?.filter((item: any) => item?.isTrue)
                            if (!filterTrue?.length) {
                              return Promise.reject(
                                'Vui lòng chọn đáp án'
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
                                              (subField.name + 1)
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
                                  dependencies={[
                                    ['questionData', field.name, 'answerType'],
                                  ]}
                                  noStyle
                                >
                                  {({ getFieldValue }: any) => {
                                    return getFieldValue([
                                      'questionData',
                                      field.name,
                                      'answerType',
                                    ]) === AnswerTypeEnum.CHECKOX ? (
                                      <Form.Item
                                        noStyle
                                        name={[subField.name, 'isTrue']}
                                        valuePropName='checked'
                                      >
                                        <Checkbox />
                                      </Form.Item>
                                    ) : (
                                      <Form.Item
                                        noStyle
                                        name={[subField.name, 'isTrue']}
                                        valuePropName='checked'
                                      >
                                        <Radio
                                          onChange={(event) => {
                                            const anwserList =
                                              form.getFieldValue([
                                                'questionData',
                                                field.name,
                                                'answerList',
                                              ]);

                                            const updateAnwser =
                                              anwserList?.map((item: any) => {
                                                return {
                                                  ...item,
                                                  isTrue: false,
                                                };
                                              });

                                            form.setFieldValue(
                                              [
                                                'questionData',
                                                field.name,
                                                'answerList',
                                              ],
                                              updateAnwser
                                            );

                                            form.setFieldValue(
                                              [
                                                'questionData',
                                                field.name,
                                                'answerList',
                                                subField.name,
                                                'isTrue',
                                              ],
                                              true
                                            );
                                          }}
                                        />
                                      </Form.Item>
                                    );
                                  }}
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
