import React from 'react';
import { Avatar, List } from 'antd';

type SideListInfoProps = {
  dataList: {
    href: string;
    title: string;
    avatar: string;
    description: string;
    content: string;
    extraTitleDesc?: React.ReactNode;
    bagde?: React.ReactNode;
    titleTag?: React.ReactNode;
    action?: React.ReactNode[]
  }[];
};

const SideListInfo: React.FC<SideListInfoProps> = (props) => (
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
        <List.Item
          key={item?.title}
          actions={item?.action}
        >
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} className='w-[80px] h-[80px]' />}
            title={
              <div className='flex items-center'>
                <a
                  href={item.href}
                  className='text-left !text-primary text-2xl font-semibold'
                >
                  {item.title}
                </a>
                <div className='ml-[20px]'>{item?.titleTag || <></>}</div>
              </div>
            }
            description={
              <div>
                <p className='text-xl'>{item.description}</p>
                {item?.extraTitleDesc}
              </div>
            }
            className='text-left'
          />
          {<p className='text-lg text-left'>{item.content}</p>}
        </List.Item>
      )}
    />
  </div>
);

export default SideListInfo;
