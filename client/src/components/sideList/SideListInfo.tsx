import React from 'react';
import { Avatar, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';

type SideListInfoProps = {
  dataList: {
    href?: string;
    title: string;
    avatar?: string | React.ReactNode;
    description: string;
    content: string;
    createdAt?: string;
    extraTitleDesc?: React.ReactNode;
    bagde?: React.ReactNode;
    titleTag?: React.ReactNode;
    action?: React.ReactNode[];
  }[];
  dislayActionBtn?: boolean;
};

const SideListInfo: React.FC<SideListInfoProps> = (props) => {
  const navigate = useNavigate();

  return (
    <div className='side-list-info'>
      <List
        itemLayout='vertical'
        size='large'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={props?.dataList}
        renderItem={(item) => (
          <List.Item key={item?.title} actions={item?.action}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    item.avatar ||
                    'https://us.123rf.com/450wm/cowpland/cowpland1703/cowpland170300191/74369634-programme-de-formation-sportive.jpg?ver=6'
                  }
                  className='w-[80px] h-[80px]'
                />
              }
              title={
                <div className='flex items-center'>
                  <a
                    href={item.href}
                    className='text-left !text-primary text-xl font-semibold'
                  >
                    {item.title}
                  </a>
                  <div className='ml-[20px]'>{item?.titleTag || <></>}</div>
                </div>
              }
              description={
                <div>
                  <p className='text-base'>{item.description}</p>
                  {item?.extraTitleDesc}
                </div>
              }
              className='text-left'
            />
            <p className='text-base text-left'>{item.content}</p>
            <p className='text-base text-[#9c9c9a] text-left'>
              Ngày đăng tải: {item?.createdAt}
            </p>
            {props?.dislayActionBtn ? (
              <div className='mt-[24px]'>
                <Button
                  className='bg-primary text-white text-lg pb-[35px] px-[40px] hover:!bg-primary hover:!text-white'
                  onClick={() => navigate(item?.href || '/')}
                >
                  Làm bài
                </Button>
              </div>
            ) : (
              <></>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default SideListInfo;
