import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Typography,
  message,
} from 'antd';
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
import dayjs from 'dayjs';
import { parseJSON } from '../../../../utils/handleData';
import { LOGIN_KEY, YEAR_OPTION } from '../../../../constants/table';

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
        totalQuestion: formData?.totalQuestion,
        examStructure: formData?.examStructure,
        year: formData?.year,
        semester: formData?.semester,
        teacherCode: customerData?.username,
        poems: formData.poems?.map((item: any) => {
          console.log("dayjs(item.time).format('HH:mm:ss') >> ", dayjs(item.time).format('HH:mm:ss'));
          console.log("dayjs(item.time) >> ", dayjs(item.time));
          
          return {
            date: dayjs(item.date).format('DD-MM-YYYY'),
            time: dayjs(item.time).format('HH:mm:ss')
          }
        }),
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
          totalQuestion: formData?.totalQuestion,
          examStructure: formData?.examStructure,
          year: formData?.year,
          semester: formData?.semester,
          teacherCode: customerData?.username,
          poems: formData.poems?.map((item: any) => {
            return {
              date: dayjs(item.date).format('DD-MM-YYYY'),
              time: dayjs(item.time).format('HH:mm:ss')
            }
          }),
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
          description: props?.initData?.description,
          testTime: props?.initData?.testTime,
          totalQuestion: props?.initData?.totalQuestion,
          examStructure: props?.initData?.examStructure,
          year: props?.initData?.year,
          semester: props?.initData?.semester,
          poems: props?.initData?.poems?.map((item) => {
            return {
              date: dayjs(item.date, 'DD-MM-YYYY'),
              time: dayjs(item.time, 'HH:mm:ss')
            }
          })
          // startTime: props?.initData?.startTime
          //   ? dayjs(props?.initData?.startTime)
          //   : '',
        }}
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
          label='Số lượng câu hỏi'
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng câu hỏi' },
            {
              validator: async (_, testTime) => {
                if (testTime <= 0) {
                  return Promise.reject('Số lượng câu hỏi cần lớn hơn 0');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='totalQuestion'
        >
          <Input type='number' placeholder='Nhập vào số lượng câu hỏi' />
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
          label='Học kì'
          rules={[
            { required: true, message: 'Vui lòng chọn học kì' },
            {
              validator: async (_, semester) => {
                if (semester <= 0) {
                  return Promise.reject('Học kì cần lớn hơn 0');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='semester'
        >
          <Input type='number' placeholder='Nhập vào học kì' />
        </Form.Item>

        <p>Ca thi</p>
        <Form.List
          name='poems'
          rules={[
            {
              validator: async (_, poems) => {
                if (!poems || poems.length < 1) {
                  return Promise.reject(new Error('Cần thêm ít nhất 1 ca thi'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{ display: 'flex', marginBottom: 8, gap: '10px' }}
                >
                  <div className='w-[40%]'>
                    <Form.Item
                      {...restField}
                      validateTrigger={['onChange', 'onBlur']}
                      name={[name, 'date']}
                      rules={[
                        { required: true, message: 'Vui lòng chọn ngày thi' },
                      ]}
                    >
                      <DatePicker
                        picker='date'
                        style={{ width: '100%' }}
                        popupClassName='exam-kit-datetime'
                        placeholder='Ngày thi'
                      ></DatePicker>
                    </Form.Item>
                  </div>
                  <div className='w-[40%]'>
                    <Form.Item
                      {...restField}
                      validateTrigger={['onChange', 'onBlur']}
                      name={[name, 'time']}
                      rules={[
                        { required: true, message: 'Vui lòng chọn giờ thi' },
                      ]}
                    >
                      <DatePicker
                        picker='time'
                        style={{ width: '100%' }}
                        popupClassName='exam-kit-datetime'
                        placeholder='Giờ thi'
                      ></DatePicker>
                    </Form.Item>
                  </div>

                  <MinusCircleOutlined onClick={() => remove(name)} className='mt-[-25px]'/>
                </div>
              ))}

              <Form.Item>
                <Button
                  type='dashed'
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm ca thi
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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

                const totalQuestion = form.getFieldValue('totalQuestion');
                const count = examStructure?.reduce(
                  (pre: number, cur: any) =>
                    Number(pre) + Number(cur?.numberQuestion),
                  [0]
                );

                if (Number(totalQuestion) !== Number(count)) {
                  return Promise.reject(
                    'Số lượng câu hỏi từng chương phải bằng tổng số lượng'
                  );
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

                <div className='number-question'>Số lượng câu hỏi</div>
              </div>

              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className='structure-item-wrap'>
                  <div className='structure-chapter'>
                    <Form.Item
                      name={[name, 'chapterId']}
                      rules={[
                        { required: true, message: 'Vui lòng chọn chương' },
                        {
                          validator: async (_, chapter) => {
                            const allStructure =
                              form.getFieldValue('examStructure');
                            const find = allStructure?.filter(
                              (it: any) => it?.chapterId === chapter
                            );

                            if (find?.length > 1) {
                              return Promise.reject(
                                'Chương này đã được lựa chọn'
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Select>
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
