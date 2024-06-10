import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Menu,
  Button,
  theme,
  Dropdown,
  MenuProps,
  Avatar,
  Typography,
} from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { MenuItem } from './menuItem';
import AdminIcon from '../../assets/imgs/admin_icon.png';
import './style.scss';
import { parseJSON } from '../../utils/handleData';
import { LOGIN_KEY } from '../../constants/table';
import { LOGIN_TYPE } from '../../enums';

const { Header, Sider, Content } = Layout;
const { Paragraph } = Typography;

type AdminLayoutProps = {
  children?: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a href='/admin/info' className='text-base'>
          Thông tin
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <div
          className='text-base'
          onClick={() => {
            let customerData = parseJSON(localStorage.getItem(LOGIN_KEY), {});
            localStorage.clear();

            if (customerData.type === LOGIN_TYPE.ADMIN) {
              navigate('/admin/login');
            } else {
              navigate('/login');
            }
          }}
        >
          Đăng xuất
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className='min-h-[100vh] max-h-[100vh]'
      >
        <div className='flex mb-[50px] mt-[40px] items-center pl-[20px]'>
          <img src={AdminIcon} alt='admin-icon' className='w-12 h-12' />
          {!collapsed ? (
            <Paragraph className='text-white text-xl !mb-0 tracking-widest font-bold'>
              VNUA
            </Paragraph>
          ) : (
            <></>
          )}
        </div>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['1']}
          items={MenuItem()}
          className='text-lg'
        />
      </Sider>
      <Layout className='min-h-[100vh] max-h-[100vh]'>
        <Header
          style={{ background: colorBgContainer }}
          className='flex justify-between items-center pr-[40px] pl-0'
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items }} placement='bottom' trigger={['click']}>
            <Avatar
              size='large'
              icon={<UserOutlined />}
              className='cursor-pointer'
            />
          </Dropdown>
        </Header>
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className='mx-[16px] my-[24px] p-[24px] overflow-y-auto'
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
