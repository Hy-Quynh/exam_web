import { List, Typography } from 'antd';
import './style.scss';

const { Paragraph } = Typography;

type BasicSideListProps = {
  headerColor?: string;
  headerText?: string;
  dataList: any[];
  currentSelect?: string;
  handleChangeSelect?: (id: string) => void;
};

const BasicSideList: React.FC<BasicSideListProps> = (props) => {
  return (
    <div className='custom-side-list'>
      <List
        header={
          <div
            className={`${props?.headerColor} text-white text-3xl py-[20px] text-left px-[20px] rounded-t-lg`}
          >
            {props?.headerText}
          </div>
        }
        footer={<div>Footer</div>}
        bordered
        dataSource={props.dataList}
        renderItem={(item, index) => (
          <List.Item
            key={`side-list-${index}`}
            className={`cursor-pointer ${
              props?.currentSelect === item?._id ? 'bg-[#d1d1cf]' : ''
            }`}
            onClick={() => {
              if (item?._id) props?.handleChangeSelect?.(item?._id);
            }}
          >
            <Paragraph className='!my-0 text-lg'>{item?.name}</Paragraph>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BasicSideList;
