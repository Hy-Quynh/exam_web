import { Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import AuthIcon from '../../assets/imgs/auth_page_icon.png';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './style.scss';
import React from 'react';

const { Paragraph } = Typography;

type LoginFieldType = {
  studentCode?: string;
  password?: string;
};

type LoginPageProps = {
  icon?: string;
  bg?: string;
  titleText?: string;
  descText?: string;
  loginButtonColor?: string;
  loginButtonText?: string;
};

const LoginPage: React.FC<LoginPageProps> = (props) => {
  return (
    <div
      className={`flex justify-center items-center h-[100vh] ${
        props?.bg || 'bg-purple'
      } overflow-hidden`}
    >
      <Card className='md:w-[80vw] lg:w-[60vw] lg:min-w-[900px] w-[90vw] min-h-[60vh] flex justify-center flex-col md:p-[40px] shadow-lg p-0'>
        <Row>
          <Col lg={10} md={0}>
            <img
              src={props?.icon || AuthIcon}
              alt='auth-icon'
              className='w-full hidden lg:block h-[calc(1*100%)]'
            />
          </Col>
          <Col lg={2} md={0}></Col>
          <Col lg={12} md={24} className='flex flex-col justify-center w-full'>
            <div>
              <Paragraph className='md:text-3xl text-2xl text-left font-bold !mb-[10px]'>
                {props?.titleText || 'ĐĂNG NHẬP'}
              </Paragraph>
              <Paragraph className='md:text-xl text-lg text-left font-normal'>
                {props?.descText ||
                  'Vui lòng nhập thông tin MSSV và Mật Khẩu của bạn!'}
              </Paragraph>
              <Form name='login-form' autoComplete='off' layout='vertical'>
                <Form.Item<LoginFieldType>
                  name='studentCode'
                  rules={[{ required: true, message: 'Vui lòng nhập MSSV' }]}
                  className='mt-[40px]'
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder='Vui lòng nhập MSSV'
                    className='h-[60px] text-xl'
                  />
                </Form.Item>

                <Form.Item<LoginFieldType>
                  name='password'
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                  ]}
                  className='mt-[40px]'
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='Vui lòng nhập mật khẩu'
                    className='h-[60px] text-xl'
                  />
                </Form.Item>
                <Form.Item className='flex justify-center'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className={`${props?.loginButtonColor || 'bg-purple'} ${
                      props?.loginButtonText || 'text-white'
                    } px-[60px] hover:!${
                      props?.loginButtonColor || 'bg-purple'
                    } hover:!${
                      props?.loginButtonText || 'text-white'
                    } md:text-2xl text-xl pb-[50px] pt-[10px] mt-[40px] font-bold`}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LoginPage;
