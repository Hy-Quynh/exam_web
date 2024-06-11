import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Grid,
  Layout,
  Menu,
  MenuProps,
  Row,
  Space,
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
  DownOutlined,
} from '@ant-design/icons';
import { ROUTER } from '../../enums/router/router';
import { subjectAPI } from '../../services/subjects';
import { parseJSON } from '../../utils/handleData';
import { LOGIN_KEY } from '../../constants/table';
import { LOGIN_TYPE } from '../../enums';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Paragraph } = Typography;

const renderNavItem = (textColor?: string) => {
  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  const linkColor = textColor || '!text-white';

  const navLogined = [
    {
      key: 'exam',
      label: (
        <a href={ROUTER.EXAM_PAGE} className={`${linkColor} text-base`}>
          Đề thi
        </a>
      ),
    },
    {
      key: 'document',
      label: (
        <a href={ROUTER.DOCUMENT_PAGE} className={`${linkColor} text-base`}>
          Tài liệu
          <span className='ml-[5px]'>
            <DownOutlined />
          </span>
        </a>
      ),
      children: [] as any,
    },
  ];

  // const navNotLogin = [
  //   {
  //     key: 'about',
  //     label: (
  //       <a href={ROUTER.ABOUT} className={`${linkColor} text-base`}>
  //         Giới thiệu chung
  //       </a>
  //     ),
  //   },
  //   {
  //     key: 'contact',
  //     label: (
  //       <a href={ROUTER.CONTACT} className={`${linkColor} text-base`}>
  //         Liên hệ
  //       </a>
  //     ),
  //     children: [] as any,
  //   },
  // ];

  return useInfo?.username ? navLogined : [];
};

const ClientLayout: React.FC = () => {
  const screens = useBreakpoint();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [navItem, setNavItem] = useState(renderNavItem());
  const navigate = useNavigate();
  const useInfo = parseJSON(localStorage.getItem(LOGIN_KEY), {});

  useEffect(() => {
    if (useInfo?.type !== LOGIN_TYPE.STUDENT) {
      localStorage.clear();
    }
  }, []);

  const userDropDown: MenuProps['items'] = [
    {
      label: <a href='/student-info'>Thông tin cá nhân</a>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Đăng xuất
        </div>
      ),
      key: '1',
    },
  ];

  const getNavDocumentItem = async () => {
    try {
      const res = await subjectAPI.getSubjectDiscipline(true);

      if (res?.data?.payload?.length && useInfo.type === LOGIN_TYPE.STUDENT) {
        const nav = [...renderNavItem()];
        nav[1].children = [...res?.data?.payload]?.map((item) => {
          return {
            key: item?._id,
            label: (
              <a href={`${ROUTER.DOCUMENT_PAGE}?subject=${item?._id}`}>
                {item?.name}
              </a>
            ),
            children: item?.listDiscipline?.map((it: any) => {
              return {
                key: it?._id,
                label: (
                  <a
                    href={`${ROUTER.DOCUMENT_PAGE}?subject=${item?._id}&discipline=${it?._id}`}
                  >
                    {it?.name}
                  </a>
                ),
                children: it?.chapters?.map((chapter: any) => {
                  return {
                    key: chapter?._id,
                    label: (
                      <a
                        href={`${ROUTER.DOCUMENT_PAGE}?subject=${item?._id}&discipline=${it?._id}&chapter=${chapter?._id}`}
                      >
                        {chapter?.name}
                      </a>
                    ),
                  };
                }),
              };
            }),
          };
        });
        setNavItem(nav);
      }
    } catch (error) {
      console.log('getNavDocumentItem error >> ', error);
    }
  };

  useEffect(() => {
    getNavDocumentItem();
  }, []);

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
                items={navItem}
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
              {useInfo?.username ? (
                <Dropdown menu={{ items: userDropDown }} trigger={['click']}>
                  <a
                    onClick={(e) => e.preventDefault()}
                    className='text-white text-base'
                  >
                    <Space>
                      <p className='text-[#6aa84f] font-bold'>
                        {useInfo?.name}
                      </p>
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              ) : (
                <Button
                  type='primary'
                  className='!bg-[#448A1E]'
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
              )}
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

export default ClientLayout;
