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
import { Outlet } from 'react-router-dom';
import { MenuItem } from './menuItem';
import AdminIcon from '../../assets/imgs/admin_icon.png';

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

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a href='/admin/info' className='text-lg'>
          Thông tin
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a href='/logout' className='text-lg'>
          Đăng xuất
        </a>
      ),
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className='min-h-[100vh] max-h-[100vh]'>
        <div className='flex mb-[50px] mt-[40px] items-center pl-[20px]'>
          <img src={AdminIcon} alt='admin-icon' className='w-12 h-12' />
          {!collapsed ? (
            <Paragraph className='text-white text-2xl !mb-0 tracking-widest font-bold'>
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
          items={MenuItem}
          className='text-lg'
        />
      </Sider>
      <Layout>
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
          className='mx-[16px] my-[24px] p-[24px]'
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
