import React, { useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Grid,
  Layout,
  Menu,
  Row,
  Typography,
} from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import WebLogo from '../../assets/imgs/auth_page_icon.png';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FacebookOutlined,
  TikTokOutlined,
  LinkedinOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import { ROUTER } from '../../enums/router/router';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Paragraph } = Typography;

const renderNavItem = (textColor?: string) => {
  const linkColor = textColor || '!text-white';

  const navItems = [
    {
      key: 'exam',
      label: (
        <a href={ROUTER.EXAM_PAGE} className={`${linkColor} text-base`}>
          Đề thi
        </a>
      ),
    },
    {
      key: 'news',
      label: (
        <a href={ROUTER.NEW_PAGE} className={`${linkColor} text-base`}>
          Tin tức
        </a>
      ),
    },
    {
      key: 'document',
      label: (
        <a href={ROUTER.DOCUMENT_PAGE} className={`${linkColor} text-base`}>
          Tài liệu
        </a>
      ),
    },
  ];
  return navItems;
};

const App: React.FC = () => {
  const screens = useBreakpoint();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Layout>
      <Header className='!py-0 px-[20px] h-[80px] flex-col flex justify-center'>
        <Row>
          <Col lg={6} md={6} span={5} className='flex-col flex justify-center'>
            <div
              className='flex items-center cursor-pointer'
              onClick={() => {
                navigate('/');
              }}
            >
              <img
                src={WebLogo}
                alt='logo'
                className='md:w-[60px] md:h-[60px] w-[40px] h-[40px]'
              />
              {screens?.md ? (
                <Paragraph
                  className={`text-white ${
                    !screens?.lg ? 'text-2xl' : 'text-2xl'
                  } !mb-0 tracking-widest font-bold mt-[10px]`}
                >
                  VNUA
                </Paragraph>
              ) : (
                <></>
              )}
            </div>
          </Col>
          <Col lg={12} md={14} span={13}>
            {screens?.md ? (
              <Menu
                theme='dark'
                mode='horizontal'
                defaultSelectedKeys={['2']}
                items={renderNavItem()}
                className={`${
                  !screens?.lg ? 'text-xl' : 'text-2xl'
                } text-white`}
              />
            ) : (
              <div className='justify-start flex w-full'>
                <Button
                  type='text'
                  icon={
                    openDrawer ? (
                      <MenuUnfoldOutlined className='text-white ' />
                    ) : (
                      <MenuFoldOutlined className='text-white' />
                    )
                  }
                  onClick={() => setOpenDrawer(!openDrawer)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
              </div>
            )}
          </Col>
          <Col lg={6} md={4} span={6} className='flex-col flex justify-center'>
            <div className='flex justify-end items-center'>
              <Button
                type='primary'
                className='bg-purple'
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
            </div>
          </Col>
        </Row>
      </Header>
      <Content className='p-[10px] md:p-[40px]'>
        <Outlet />
      </Content>
      <Footer className='bg-[#001528] text-white text-left md:p-[40px] p-[20px]'>
        <Row>
          <Col span={12} className='lg:pl-[100px] pl-0'>
            <p className='md:text-3xl text-2xl font-semibold leading-7'>VNUA</p>
            <p className='md:text-lg text-sm font-medium mt-[20px]'>
              HỌC VIỆN NÔNG NGHIỆP VIỆT NAM
            </p>
            <p className='mt-[30px] md:text-xl text-lg font-semibold'>
              Follow Us
            </p>
            <div className='mt-[20px] flex items-center gap-[10px]'>
              <FacebookOutlined className='md:text-[25px] text-[20px]' />
              <TikTokOutlined className='md:text-[25px] text-[20px' />
              <LinkedinOutlined className='md:text-[25px] text-[20px' />
              <InstagramOutlined className='md:text-[25px] text-[20px' />
            </div>
          </Col>
          <Col span={12}>
            <p className='md:text-xl text-base font-semibold'>
              THÔNG TIN LIÊN HỆ
            </p>
            <p className='md:text-lg text-sm font-medium md:mt-[20px] mt-[10px]'>
              Hà Nội, Việt Nam
            </p>
            <p className='mdtext-lg text-sm font-medium md:mt-[20px] mt-[10px]'>
              Email: vnua@vnua.com.vn
            </p>
            <p className='md:text-lg text-sm font-medium md:mt-[20px] mt-[10px]'>
              Số ĐT: 08877272811
            </p>
          </Col>
        </Row>
      </Footer>

      {openDrawer ? (
        <Drawer
          title={
            <div className='flex items-center'>
              <img src={WebLogo} alt='admin-icon' className='w-12 h-12' />
              <Paragraph className='text-black text-2xl !mb-0 tracking-widest font-bold'>
                VNUA
              </Paragraph>
            </div>
          }
          placement={'left'}
          closable={false}
          onClose={() => setOpenDrawer(!openDrawer)}
          open={openDrawer}
          key={'drawer-menu'}
          width={200}
        >
          {renderNavItem?.('!text-black')?.map((item, index) => {
            return (
              <div key={item?.key}>
                {item?.label}
                {index + 1 !== renderNavItem()?.length ? (
                  <Divider className='my-[10px]' />
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </Drawer>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default App;
