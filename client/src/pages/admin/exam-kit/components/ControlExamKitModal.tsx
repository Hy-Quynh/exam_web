import { Button, Form, Input, Select, Typography, message } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { ModalControlType } from '../../../../types/modal';
import { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import '../style.scss';
import { DisciplineType } from '../../discipline/Discipline';
import { disciplineAPI } from '../../../../services/disciplines';
import { ExamKitType } from '../ExamKit';
import { examKitAPI } from '../../../../services/exam-kit';
import { ExamKitDataType } from '../../../../types/examKit';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY, YEAR_OPTION } from '../../../../constants/table';
import { LOGIN_TYPE } from '../../../../enums';
import { examAPI } from '../../../../services/exams';

type ControlExamKitProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  title: string;
  type: ModalControlType;
  initData?: ExamKitType;
};

const { TextArea } = Input;

const ControlExamKitModal: React.FC<ControlExamKitProps> = (props) => {
  const [disciplineList, setDisciplineList] = useState<DisciplineType[]>([]);
  const [disciplineChapter, setDisciplineChapter] = useState<any>([]);
  const [chapterExam, setChapterExam] = useState<any>([]);

  const [form] = Form.useForm();
  const customerData = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  useEffect(() => {
    if (props?.initData?.disciplineId && disciplineList?.length) {
      const findDiscipline = disciplineList?.find(
        (it) => it?._id === props?.initData?.disciplineId
      );
      setDisciplineChapter(findDiscipline?.chapters);
      getExamList(props?.initData?.disciplineId);
    }
  }, [props?.initData?.disciplineId, disciplineList]);

  const getDisciplineList = async () => {
    try {
      const res = await disciplineAPI.getAllDiscipline(
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );
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
        await handleAddExamKit();
      }

      if (props.type === 'UPDATE') {
        await hanldleUpdateExamKit();
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  const handleAddExamKit = async () => {
    try {
      const formData = form.getFieldsValue();

      const examKitData: ExamKitDataType = {
        name: formData?.name,
        disciplineId: formData?.disciplineId,
        description: formData?.description,
        testTime: formData?.testTime,
        examStructure: formData?.examStructure,
        year: formData?.year,
        teacherCode: customerData?.username,
      };

      const res = await examKitAPI.addNewExamKit(examKitData);

      if (res?.data?.success) {
        message.success('Thêm thông tin bộ đề thi thành công');
        props?.reloadData();
      } else {
        message.error(
          res?.data?.error?.message || 'Thêm thông tin bộ đề thi thất bại'
        );
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const hanldleUpdateExamKit = async () => {
    try {
      if (props?.initData?._id) {
        const formData = form.getFieldsValue();
        const examKitData: ExamKitDataType = {
          name: formData?.name,
          disciplineId: formData?.disciplineId,
          description: formData?.description,
          testTime: formData?.testTime,
          examStructure: formData?.examStructure,
          year: formData?.year,
          teacherCode: customerData?.username,
        };

        const res = await examKitAPI.updateExamKit(
          props?.initData?._id,
          examKitData
        );

        if (res?.data?.success) {
          message.success('Cập nhật thông tin bộ đề thi thành công');
          props?.reloadData();
        } else {
          message.error(
            res?.data?.error?.message || 'Cập nhật thông tin bộ đề thi thất bại'
          );
        }
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleChangeOpenStatus = async () => {
    try {
      if (!props?.initData?._id) {
        return message.error('Cập nhật thất bại');
      }

      const res = await examKitAPI.updateExamKitOpen(
        props?.initData?._id,
        !props?.initData?.openExamStatus ? true : false
      );
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        props?.reloadData();
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

  const getExamList = async (discipline?: string) => {
    try {
      const exam = await examAPI.getAllExam(
        undefined,
        undefined,
        '',
        discipline,
        undefined,
        undefined,
        undefined,
        true
      );
      if (exam?.data?.success) {
        const examData = exam?.data?.payload?.exam;
        const groupExam = examData?.reduce((pre: any, curr: any) => {
          const groupKey = curr['chapterId'];
          if (!pre[groupKey]) {
            pre[groupKey] = [];
          }
          pre[groupKey].push(curr);

          return pre;
        }, {});

        setChapterExam(groupExam);
      }
    } catch (error) {
      message.error('Lấy thông tin bộ đề thất bại');
    }
  };

  return (
    <CustomModal
      isOpen={props?.isOpen}
      handCanel={() => props?.handleCancel()}
      title={props.title}
      handleSubmit={() => submitForm()}
      width={'70vw'}
      disableSubmitBtn={customerData.type === LOGIN_TYPE.ADMIN}
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{
          name: props?.initData?.name,
          disciplineId: props?.initData?.disciplineId,
          description: props?.initData?.description,
          testTime: props?.initData?.testTime,
          examStructure: props?.initData?.examStructure,
          year: props?.initData?.year,
        }}
        disabled={customerData.type === LOGIN_TYPE.ADMIN}
      >
        <Form.Item
          label='Tên đề kiểm tra'
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Vui lòng tên đề kiểm tra',
            },
          ]}
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
              form.setFieldValue('examStructure', []);
              const findDiscipline = disciplineList?.find(
                (it) => it?._id === value
              );
              setDisciplineChapter(findDiscipline?.chapters);
              getExamList(findDiscipline?._id);
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
          label='Thời gian làm bài'
          rules={[
            { required: true, message: 'Vui lòng nhập thời gian làm bài' },
            {
              validator: async (_, testTime) => {
                if (testTime <= 0) {
                  return Promise.reject('Thời gian làm bài cần lớn hơn 0');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='testTime'
        >
          <Input type='number' placeholder='Nhập vào thời gian làm bài' />
        </Form.Item>

        <Form.Item
          label='Năm học'
          name='year'
          rules={[{ required: true, message: 'Vui lòng chọn năm học' }]}
        >
          <Select>
            {YEAR_OPTION?.map((item: any) => {
              return (
                <Select.Option value={item?.key} key={item?.key + 'year'}>
                  {item?.label}
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

        {props?.type === 'UPDATE' ? (
          <div className='mb-[20px]'>
            <Button
              className={`${
                props?.initData?.openExamStatus
                  ? 'bg-[red] hover:!bg-[red]'
                  : 'bg-primary hover:!bg-primary '
              } hover:!text-white text-white border-none`}
              onClick={() => handleChangeOpenStatus()}
            >
              {props?.initData?.openExamStatus ? 'Kết thúc thi' : 'Bắt đầu thi'}
            </Button>
          </div>
        ) : (
          <></>
        )}

        <Typography.Paragraph>Bộ câu hỏi</Typography.Paragraph>

        <Form.List
          name='examStructure'
          rules={[
            {
              validator: async (_, examStructure) => {
                if (!examStructure || examStructure?.length <= 0) {
                  return Promise.reject('Vui lòng thêm câu hỏi cho chương');
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div className='question-structure-modal'>
              <div className='list-title'>
                <div className='title'>Chương</div>
                <div className='title'>Tên đề</div>
                <div className='number-question'>Số lượng câu hỏi</div>
              </div>

              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className='structure-item-wrap'>
                  <div className='structure-chapter'>
                    <Form.Item
                      name={[name, 'chapterId']}
                      rules={[
                        { required: true, message: 'Vui lòng chọn chương' },
                      ]}
                    >
                      <Select
                        onChange={(value) => {
                          form.setFieldValue(
                            ['examStructure', name, 'examId'],
                            ''
                          );
                        }}
                      >
                        {disciplineChapter?.map((item: any, index: number) => {
                          return (
                            <Select.Option value={item?._id} key={item?._id}>
                              {`Chương ${index + 1}: ${item?.name}`}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='structure-chapter'>
                    <Form.Item
                      shouldUpdate={(prevValues: any, currentValues) => {
                        return (
                          prevValues?.examStructure !==
                          currentValues?.examStructure
                        );
                      }}
                      noStyle
                    >
                      {({ getFieldValue }) => {
                        const chapterId = getFieldValue([
                          'examStructure',
                          name,
                          'chapterId',
                        ]);

                        return (
                          <Form.Item
                            name={[name, 'examId']}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn tên đề',
                              },
                              {
                                validator: async (_, examId) => {
                                  const allStructure =
                                    form.getFieldValue('examStructure');
                                  const chapter = form.getFieldValue([
                                    'examStructure',
                                    name,
                                    'chapterId',
                                  ]);

                                  const find = allStructure?.filter(
                                    (it: any) =>
                                      it?.chapterId === chapter &&
                                      it?.examId === examId
                                  );

                                  if (find?.length > 1) {
                                    return Promise.reject(
                                      'Đề này đã được lựa chọn'
                                    );
                                  }

                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Select>
                              {chapterExam[chapterId]?.map(
                                (item: any, index: number) => {
                                  return (
                                    <Select.Option
                                      value={item?._id}
                                      key={item?._id}
                                    >
                                      {item?.name}
                                    </Select.Option>
                                  );
                                }
                              )}
                            </Select>
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </div>

                  <div className='structure-question'>
                    <Form.Item
                      {...restField}
                      name={[name, 'numberQuestion']}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập số lượng câu hỏi',
                        },
                        {
                          validator: async (_, numberQuestion) => {
                            if (numberQuestion <= 0) {
                              return Promise.reject(
                                'Số lượng câu hỏi cần lớn hơn 0'
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        type='number'
                        placeholder='Vui lòng nhập số lượng câu hỏi'
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item>
                <Button
                  type='dashed'
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm số lượng câu hỏi
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </CustomModal>
  );
};

export default ControlExamKitModal;
