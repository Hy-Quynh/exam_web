import { Button, Card, Col, Form, Input, Row, Spin, Typography } from 'antd';
import AuthIcon from '../../assets/imgs/auth_page_icon.png';
import { LockOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import './style.scss';
import React, { useState } from 'react';

const { Paragraph } = Typography;

type LoginFieldType = {
  username?: string;
  password?: string;
};

type LoginPageProps = {
  icon?: string;
  bg?: string;
  titleText?: string;
  descText?: string;
  loginButtonColor?: string;
  loginButtonText?: string;
  handleLogin?: (values: any) => Promise<void>;
};

const LoginPage: React.FC<LoginPageProps> = (props) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

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
              className='w-full hidden lg:block h-[calc(0.8*100%)]'
            />
          </Col>
          <Col lg={2} md={0}></Col>
          <Col lg={12} md={24} className='flex flex-col justify-center w-full'>
            <div>
              <Paragraph className='md:text-2xl text-2xl text-left font-bold !mb-[10px]'>
                {props?.titleText || 'ĐĂNG NHẬP'}
              </Paragraph>
              <Paragraph className='md:text-lg text-lg text-left font-normal'>
                {props?.descText ||
                  'Vui lòng nhập Tên đăng nhập và Mật Khẩu của bạn!'}
              </Paragraph>
              <Form
                name='login-form'
                autoComplete='off'
                layout='vertical'
                onFinish={async (values) => {
                  setIsLogin(true);
                  await props?.handleLogin?.(values);
                  setIsLogin(false);
                }}
              >
                <Form.Item<LoginFieldType>
                  name='username'
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                  ]}
                  className='mt-[20px]'
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder='Vui lòng nhập tên đăng nhập'
                    className='h-[45px] text-lg'
                  />
                </Form.Item>

                <Form.Item<LoginFieldType>
                  name='password'
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                  ]}
                  className='mt-[20px]'
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='Vui lòng nhập mật khẩu'
                    className='h-[45px] text-lg'
                  />
                </Form.Item>
                <Form.Item className='flex justify-center'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className={`${props?.loginButtonColor || '!bg-purple'} ${
                      props?.loginButtonText || 'text-white'
                    } px-[60px] hover:!${
                      props?.loginButtonColor || '!bg-purple'
                    } hover:!${
                      props?.loginButtonText || 'text-white'
                    } md:text-xl text-xl pb-[40px] pt-[10px] mt-[20px] font-bold
                    `}
                    disabled={isLogin}
                  >
                    {!isLogin ? 'Đăng nhập' : <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />} />}
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
